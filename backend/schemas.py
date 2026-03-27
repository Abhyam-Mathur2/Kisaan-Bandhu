from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# User & Profile
class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    location_lat_long: Optional[Dict[str, float]] = None
    phone_number: Optional[str] = None
    language_preference: str = "en"

class Profile(ProfileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Fields/Farms
class FieldBase(BaseModel):
    field_name: str
    area_size_acres: Optional[float] = None
    coordinates: Optional[Dict[str, Any]] = None

class FieldCreate(FieldBase):
    user_id: UUID

class Field(FieldBase):
    id: UUID
    user_id: UUID
    created_at: datetime

# Soil Data
class SoilReportBase(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    moisture_percentage: float

class SoilReport(SoilReportBase):
    id: UUID
    field_id: UUID
    report_date: datetime

# AI Recommendations
class Recommendation(BaseModel):
    id: UUID
    crop_suggested: str
    confidence: float
    rationale: str
    actions: List[str]
    created_at: datetime

# Alerts
class Alert(BaseModel):
    id: UUID
    title: str
    message: str
    severity: str
    is_read: bool
    created_at: datetime

# Chat/AI Assistant
class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    user_id: UUID
    messages: List[ChatMessage]
    language: Optional[str] = "en"
