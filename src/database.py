import sqlite3

class Database:
    def __init__(self):
        self.connect()
    
    def connect(self):
        self.conn = sqlite3.connect("users.db")
    
    def commit(self):
        self.conn.commit()
    
    def close(self):
        self.conn.close()

    def create_table(self):
        self.cur = self.conn.cursor()
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT NOT NULL,
                user_password TEXT NOT NULL,
                user_height REAL,
                trimester INTEGER CHECK(trimester BETWEEN 1 AND 3),
                medical_issues TEXT,
                bmi_prepreg REAL,
                bmi_postpreg REAL,
                multiple_pregnancy BOOLEAN,
                age INTEGER,
                preference TEXT
            )
            """)
        self.commit()
        self.close()
        
    def insert_into_db(self, name, password, height, trimester, medical_issues, bmi_prepreg, bmi_postpreg, multiple_pregnancy, age, preference):
        self.connect()
        cur = self.conn.cursor()
        cur.execute("""
        INSERT INTO users (user_name, user_password, user_height, trimester, medical_issues, 
                        bmi_prepreg, bmi_postpreg, multiple_pregnancy, age, preference)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, password, height, trimester, medical_issues, bmi_prepreg, bmi_postpreg, multiple_pregnancy, age, preference))
        self.commit()
        self.close()
    
    def fetch_data(self, user_id) -> list:
        self.connect()
        cur = self.conn.cursor()
        rows = cur.fetchall()
        self.close()
        return rows

    def update_user_bmi(self, user_id, new_bmi_postpreg):
        self.connect()
        cur = self.conn.cursor()
        cur.execute("UPDATE users SET bmi_postpreg = ? WHERE user_id = ?", (new_bmi_postpreg, user_id))
        self.commit()
        self.close()

    def delete_user(self, user_id):
        self.connect()
        cur = self.conn.cursor()
        cur.execute("DELETE FROM users WHERE user_id = ?", (user_id,))
        self.commit()
        self.close()




        

