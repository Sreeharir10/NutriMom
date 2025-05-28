from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

class User(UserMixin):
    def __init__(self, id, username, email, name, height, weight, pre_pregnancy_weight, age, trimester, multiple_pregnancies, medical_conditions, diet_type, allergies):
        self.id = id
        self.username = username
        self.email = email
        self.name = name
        self.height = height
        self.weight = weight
        self.pre_pregnancy_weight = pre_pregnancy_weight
        self.age = age
        self.trimester = trimester
        self.multiple_pregnancies = multiple_pregnancies
        self.medical_conditions = medical_conditions
        self.diet_type = diet_type
        self.allergies = allergies

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        conn = sqlite3.connect('nutrilogic.db')
        cursor = conn.cursor()
        cursor.execute('SELECT password_hash FROM users WHERE id = ?', (self.id,))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return check_password_hash(result[0], password)
        return False

    @staticmethod
    def get_by_username(username):
        conn = sqlite3.connect('nutrilogic.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, username, email, name, height, weight, pre_pregnancy_weight, 
                   age, trimester, multiple_pregnancies, medical_conditions, diet_type, allergies
            FROM users WHERE username = ?
        ''', (username,))
        user_data = cursor.fetchone()
        conn.close()
        
        if user_data:
            return User(*user_data)
        return None

    @staticmethod
    def get_by_email(email):
        conn = sqlite3.connect('nutrilogic.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, username, email, name, height, weight, pre_pregnancy_weight, 
                   age, trimester, multiple_pregnancies, medical_conditions, diet_type, allergies
            FROM users WHERE email = ?
        ''', (email,))
        user_data = cursor.fetchone()
        conn.close()
        
        if user_data:
            return User(*user_data)
        return None

    @staticmethod
    def create_user(user_data):
        conn = sqlite3.connect('nutrilogic.db')
        cursor = conn.cursor()
        
        # Create users table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                height REAL NOT NULL,
                weight REAL NOT NULL,
                pre_pregnancy_weight REAL NOT NULL,
                age INTEGER NOT NULL,
                trimester INTEGER NOT NULL,
                multiple_pregnancies BOOLEAN NOT NULL,
                medical_conditions TEXT,
                diet_type TEXT NOT NULL,
                allergies TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insert new user
        cursor.execute('''
            INSERT INTO users (
                username, email, password_hash, name, height, weight,
                pre_pregnancy_weight, age, trimester, multiple_pregnancies,
                medical_conditions, diet_type, allergies
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_data['email'].split('@')[0],
            user_data['email'],
            generate_password_hash(user_data['password']),
            user_data['name'],
            user_data['height'],
            user_data['weight'],
            user_data['pre_pregnancy_weight'],
            user_data['age'],
            user_data['trimester'],
            user_data['multiple_pregnancies'] == 'yes',
            ','.join(user_data['medical_conditions']),
            user_data['diet_type'],
            user_data['allergies']
        ))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return User.get_by_username(user_data['email'].split('@')[0]) 