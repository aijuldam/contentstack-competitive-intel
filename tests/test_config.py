"""Tests for configuration loading."""

import tempfile
from pathlib import Path

import pytest

from src.utils.config import load_config, Config


@pytest.fixture
def config_path():
    return Path("config/config.yaml")


def test_load_config(config_path):
    if not config_path.exists():
        pytest.skip("Config file not found")
    config = load_config(config_path)
    assert isinstance(config, Config)
    assert config.our_company.name == "Gigs"
    assert len(config.competitors) > 0


def test_competitors_have_required_fields(config_path):
    if not config_path.exists():
        pytest.skip("Config file not found")
    config = load_config(config_path)
    for comp in config.competitors:
        assert comp.name
        assert comp.slug
        assert comp.website


def test_missing_config_raises():
    with pytest.raises(FileNotFoundError):
        load_config("nonexistent.yaml")


def test_monitoring_defaults():
    from src.utils.config import MonitoringConfig
    m = MonitoringConfig()
    assert m.default_check_interval_hours == 24
    assert m.respect_robots_txt is True
