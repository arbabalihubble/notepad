from fastapi import FastAPI, Depends, HTTPException, status, Form
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware


# Database configurations
DATABASE_URL = "sqlite:///./notepad.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

class Notepad(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    note = Column(String, index=True)
    slug = Column(String, index=True, unique=True)

# Create the tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
# Allow all origins to access your API (not recommended for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class NoteCreate(BaseModel):
    note: str
    slug: str
# Model for updating a note
class NoteUpdate(BaseModel):
    note: str

@app.get("/notes/{slug}/")
def read_or_create_note(slug: str, db: Session = Depends(get_db)):
    note_item = db.query(Notepad).filter(Notepad.slug == slug).first()
    if not note_item:
        # Create an empty note if the slug does not exist
        new_note = Notepad(note="", slug=slug)
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
        return new_note
    return note_item.note

@app.put("/notes/{slug}/")
def update_note(slug: str, updated_note: NoteUpdate, db: Session = Depends(get_db)):
    note_item = db.query(Notepad).filter(Notepad.slug == slug).first()
    if not note_item:
        raise HTTPException(status_code=404, detail="Note not found")
    
    note_item.note = updated_note.note
    db.commit()
    db.refresh(note_item)
    return {"message": "Note updated successfully", "updated_note": note_item}
