import socketio
from fastapi import FastAPI, Depends, HTTPException, WebSocket 
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import uuid

# Database configurations
DATABASE_URL = "postgresql://arbab:0312o2o2@localhost/notepad"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

class Notepad(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    note = Column(String, index=True)
    shareable=Column(String, index=True, unique=True)
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
    unique_id = str(uuid.uuid4())
    note_item = db.query(Notepad).filter(Notepad.slug == slug).first()
    if not note_item:
        # Create an empty note if the slug does not exist
        new_note = Notepad(note="", slug=slug, shareable=unique_id)
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
        return new_note
    return note_item

@app.get("/notes/shareable/{shareable}/")
def read_or_create_note(shareable: str, db: Session = Depends(get_db)):
    # unique_id = str(uuid.uuid4())
    note_item = db.query(Notepad).filter(Notepad.shareable == shareable).first()
    # if not note_item:
    #     # Create an empty note if the slug does not exist
    #     new_note = Notepad(note="", slug=slug, shareable=unique_id)
    #     db.add(new_note)
    #     db.commit()
    #     db.refresh(new_note)
    #     return new_note
    return note_item

@app.put("/notes/{slug}/")
def update_note(slug: str, updated_note: NoteUpdate, db: Session = Depends(get_db)):
    note_item = db.query(Notepad).filter(Notepad.slug == slug).first()
    if not note_item:
        raise HTTPException(status_code=404, detail="Note not found")
    
    note_item.note = updated_note.note
    db.commit()
    db.refresh(note_item)
    return {"message": "Note updated successfully", "updated_note": note_item}



sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# [OPTIONAL] Define socket.io events
@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")

# Define socket.io events for joining a room
@sio.event
async def join_room(sid, room_name):
    sio.enter_room(sid, room_name)
    sio.emit('note_updated', f"Note updated at {room_name}")
    print('room joined on ')
    print(room_name)
    await sio.emit("message", f"User {sid} has entered the room {room_name}", room=room_name)
