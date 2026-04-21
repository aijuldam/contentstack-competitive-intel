"""
Web fetcher with rate limiting, retries, robots.txt respect,
and text extraction from HTML.
"""

from __future__ import annotations

import asyncio
import time
from typing import Optional
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import httpx
from bs4 import BeautifulSoup

from ..utils.logging import get_logger

logger = get_logger("connectors.web_fetcher")

# Cache parsed robots.txt per domain
_robots_cache: dict[str, RobotFileParser] = {}


class FetchResult:
    def __init__(
        self,
        url: str,
        status_code: int,
        raw_html: str,
        extracted_text: str,
        title: str,
        meta_description: str,
        headers: dict[str, str],
        fetch_time: float,
        error: Optional[str] = None,
    ):
        self.url = url
        self.status_code = status_code
        self.raw_html = raw_html
        self.extracted_text = extracted_text
        self.title = title
        self.meta_description = meta_description
        self.headers = headers
        self.fetch_time = fetch_time
        self.error = error

    @property
    def ok(self) -> bool:
        return self.status_code == 200 and self.error is None


class WebFetcher:
    def __init__(
        self,
        user_agent: str = "CompetitiveIntelBot/0.1",
        timeout: int = 30,
        delay: float = 2.0,
        max_retries: int = 3,
        respect_robots: bool = True,
    ):
        self.user_agent = user_agent
        self.timeout = timeout
        self.delay = delay
        self.max_retries = max_retries
        self.respect_robots = respect_robots
        self._last_request_time: dict[str, float] = {}

    async def fetch(self, url: str) -> FetchResult:
        domain = urlparse(url).netloc

        # Respect robots.txt
        if self.respect_robots and not self._is_allowed(url):
            logger.warning(f"Blocked by robots.txt: {url}")
            return FetchResult(
                url=url, status_code=0, raw_html="", extracted_text="",
                title="", meta_description="", headers={}, fetch_time=0,
                error="Blocked by robots.txt",
            )

        # Rate limit per domain
        await self._rate_limit(domain)

        start = time.monotonic()
        for attempt in range(1, self.max_retries + 1):
            try:
                async with httpx.AsyncClient(
                    timeout=self.timeout,
                    follow_redirects=True,
                    headers={"User-Agent": self.user_agent},
                ) as client:
                    resp = await client.get(url)

                elapsed = time.monotonic() - start
                self._last_request_time[domain] = time.monotonic()

                if resp.status_code != 200:
                    logger.warning(f"HTTP {resp.status_code} for {url}")
                    return FetchResult(
                        url=url, status_code=resp.status_code,
                        raw_html=resp.text, extracted_text="",
                        title="", meta_description="",
                        headers=dict(resp.headers), fetch_time=elapsed,
                    )

                html = resp.text
                text, title, meta = self._extract(html)
                return FetchResult(
                    url=url, status_code=200,
                    raw_html=html, extracted_text=text,
                    title=title, meta_description=meta,
                    headers=dict(resp.headers), fetch_time=elapsed,
                )

            except (httpx.RequestError, httpx.TimeoutException) as exc:
                logger.warning(f"Attempt {attempt}/{self.max_retries} failed for {url}: {exc}")
                if attempt < self.max_retries:
                    await asyncio.sleep(2 ** attempt)
                else:
                    elapsed = time.monotonic() - start
                    return FetchResult(
                        url=url, status_code=0, raw_html="",
                        extracted_text="", title="", meta_description="",
                        headers={}, fetch_time=elapsed,
                        error=str(exc),
                    )

        # Should not reach here, but just in case
        return FetchResult(
            url=url, status_code=0, raw_html="", extracted_text="",
            title="", meta_description="", headers={}, fetch_time=0,
            error="Max retries exceeded",
        )

    async def fetch_many(self, urls: list[str], max_concurrent: int = 5) -> list[FetchResult]:
        semaphore = asyncio.Semaphore(max_concurrent)

        async def _bounded_fetch(u: str) -> FetchResult:
            async with semaphore:
                return await self.fetch(u)

        return await asyncio.gather(*[_bounded_fetch(u) for u in urls])

    def _is_allowed(self, url: str) -> bool:
        parsed = urlparse(url)
        domain = parsed.netloc
        if domain not in _robots_cache:
            rp = RobotFileParser()
            robots_url = f"{parsed.scheme}://{domain}/robots.txt"
            try:
                rp.set_url(robots_url)
                rp.read()
            except Exception:
                # If we can't read robots.txt, assume allowed
                return True
            _robots_cache[domain] = rp
        return _robots_cache[domain].can_fetch(self.user_agent, url)

    async def _rate_limit(self, domain: str) -> None:
        last = self._last_request_time.get(domain, 0)
        elapsed = time.monotonic() - last
        if elapsed < self.delay:
            await asyncio.sleep(self.delay - elapsed)

    @staticmethod
    def _extract(html: str) -> tuple[str, str, str]:
        soup = BeautifulSoup(html, "html.parser")

        # Remove script/style
        for tag in soup(["script", "style", "noscript", "svg", "iframe"]):
            tag.decompose()

        title = ""
        if soup.title and soup.title.string:
            title = soup.title.string.strip()

        meta_desc = ""
        meta_tag = soup.find("meta", attrs={"name": "description"})
        if meta_tag and meta_tag.get("content"):
            meta_desc = meta_tag["content"].strip()

        text = soup.get_text(separator="\n", strip=True)

        # Collapse multiple blank lines
        lines = [line.strip() for line in text.splitlines()]
        text = "\n".join(line for line in lines if line)

        return text, title, meta_desc
