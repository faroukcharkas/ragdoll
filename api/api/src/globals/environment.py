# builtin

# external
from pydantic_settings import BaseSettings, SettingsConfigDict

# internal


class Environment(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    SUPABASE_URL: str
    SUPABASE_KEY: str
    OPENAI_API_KEY: str
