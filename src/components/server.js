import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { randomBytes } from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const saltRounds = 10;
const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./MAMS.db');


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



// Sign Up ลงทะเบียน
app.post('/api/signup', async (req, res) => {
  const {
    userId, username, password, titlename, fullname, lastname,
    birthdate, department, division, positionType, position,
    email, tel
  } = req.body;

  // ตรวจว่าไม่มี field ไหนเป็น null หรือว่าง
const requiredFields = {
  userId, username, password, titlename, fullname, lastname,
  birthdate, department, division, positionType, position,
  email, tel
};

for (const [key, value] of Object.entries(requiredFields)) {
  if (value === undefined || value === null || value.toString().trim() === '') {
    return res.status(400).json({ error: `กรุณาเพิ่มข้อมูล '${key}'` });
  }
}
  
   // เช็คว่า User ID ซ้ำหรือไม่
  db.get(`SELECT * FROM AllUsers WHERE UserID = ?`, [userId], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error (UserID)' });
    if (row) return res.status(400).json({ error: 'User ID นี้ถูกใช้งานแล้ว' });

  // เช็คว่า username ซ้ำหรือไม่
  db.get(`SELECT * FROM AllUsers WHERE Username = ?`, [username], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error (Username)' });
    if (row) return res.status(400).json({ error: 'Username นี้ถูกใช้งานแล้ว' });

    // เช็ค email ซ้ำ
    db.get(`SELECT * FROM AllUsers WHERE Email = ?`, [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error (Email)' });
    if (row) return res.status(400).json({ error: 'Email นี้ถูกใช้งานแล้ว' });

    // เช็ค tel ซ้ำ
    db.get(`SELECT * FROM AllUsers WHERE Tel = ?`, [tel], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error (Tel)' });
    if (row) return res.status(400).json({ error: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // เพิ่มข้อมูลลงใน db
    const query = `
    INSERT INTO AllUsers (
    UserID, Username, Password, TitleName, FullName, LastName,
    BirthDate, Department, Division, PositType, Position,
    Email, Tel, Status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

db.run(query, [
  userId, username, hashedPassword, titlename, fullname, lastname,
  birthdate, department, division, positionType, position,
  email, tel, 1], 
    function (err) {
      if (err) {
      console.error('🔥 SQLite Error:', err.message); // เพิ่ม .message เพื่อให้เห็นข้อความชัด ๆ
      return res.status(500).json({ error: 'ลงทะเบียนไม่สำเร็จ', details: err.message });
      }

      const createdAt = new Date().toISOString();
      db.run(`INSERT INTO Log_create_account (UserID, User_created_at)
      VALUES (?, ?)`,
      [userId, createdAt]);
      res.json({ message: 'ลงทะเบียนสำเร็จแล้ว' });
    });
  });
});
});
});
});



// Sign In เข้าสู่ระบบ
app.post('/api/signin', (req, res) => {
  const { username, password } = req.body;
  const signInTime = new Date().toISOString();

  db.get(`SELECT * FROM AllUsers WHERE Username = ? AND Status = 1`, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
    }
    db.run(
      `INSERT INTO Log_SignIn_Out (UserID, User_signIn_at, User_signOut_at)
      VALUES (?, ?, NULL)`,
      [user.UserID, signInTime]
    );
    res.json({ message: 'เข้าสู่ระบบสำเร็จ', user });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// แก้ไข Email-Tel
app.post('/api/update-profile', (req, res) => {
  const { userId, email, tel } = req.body;

  if (!userId || !email || !tel) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }

  // เช็กว่า email หรือ tel ซ้ำกับคนอื่นไหม
  const checkQuery = `SELECT * FROM AllUsers WHERE (Email = ? OR Tel = ?) AND UserID != ?`;
  db.get(checkQuery, [email, tel, userId], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (existing) return res.status(400).json({ error: 'อีเมลหรือเบอร์โทรถูกใช้แล้ว' });

    // ถ้าไม่ซ้ำ → อัปเดตได้
    const updateQuery = `UPDATE AllUsers SET Email = ?, Tel = ? WHERE UserID = ?`;
    db.run(updateQuery, [email, tel, userId], function (err) {
      if (err) return res.status(500).json({ error: 'ไม่สามารถอัปเดตข้อมูลได้' });
      res.json({ message: 'อัปเดตโปรไฟล์สำเร็จ' });
    });
  });
});


// SignOut
app.post('/api/log-signout', (req, res) => {
   const { userID, timestamp } = req.body;

  if (!userID || !timestamp) {
    return res.status(400).json({ error: 'Missing userID or timestamp' });
  }

  db.run(
    `UPDATE Log_SignIn_Out
    SET User_signOut_at = ?
    WHERE rowid = (
      SELECT rowid FROM Log_SignIn_Out
      WHERE UserID = ? AND User_signOut_at IS NULL
      ORDER BY User_signIn_at DESC
      LIMIT 1
    )`,
    [timestamp, userID],
    function (err) {
      if (err) {
        console.error('❌ SignOut Log Error:', err.message);
        return res.status(500).json({ error: 'Log update failed' });
      }

      if (this.changes === 0) {
        console.warn('⚠️ No sign-in log matched to update');
      } else {
        console.log('✅ Sign-out time logged successfully');
      }

      res.json({ message: 'Sign-out log recorded' });
    }
  );
});



// ลบบัญชี
app.post('/api/deactivate', (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'ต้องระบุ UserID' });

  const query = `UPDATE AllUsers SET Status = 0 WHERE UserID = ?`;

  db.run(query, [userId], function (err) {
    if (err) {
    console.error('SQLite Error:', err.message); // ✅ เพิ่ม .message
    return res.status(500).json({ error: 'ลงทะเบียนไม่สำเร็จ', details: err.message });
  }
    if (this.changes === 0) return res.status(404).json({ error: 'ไม่พบผู้ใช้' });

    res.json({ message: 'ลบบัญชีเรียบร้อย (deactivated)' });
  });
});


//เปลี่ยนรหัสผ่าน
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'กรุณากรอกอีเมล' });

  db.get('SELECT * FROM AllUsers WHERE Email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'ไม่พบอีเมลในระบบ' });

    const token = randomBytes(32).toString('hex');
    const expiry = Date.now() + 15 * 60 * 1000; // 15 นาที

    db.run('INSERT INTO PasswordResetTokens (Email, Token, Expiry) VALUES (?, ?, ?)', [email, token, expiry], (err) => {
      if (err) return res.status(500).json({ error: 'ไม่สามารถบันทึก token ได้' });

      const resetLink = `http://localhost:5173/reset-password?token=${token}`; // ✅ ปรับตาม URL ของคุณ

      // ส่งอีเมล
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'derwat85300@gmail.com', pass: 'zqpd qxne vpae adlj' }
      });

      const mailOptions = {
        from: 'derwat85300@gmail.com',
        to: email,
        subject: 'ลิงก์รีเซ็ตรหัสผ่าน',
        text: `คลิกที่ลิงก์นี้เพื่อรีเซ็ตรหัสผ่านของคุณ:\n\n${resetLink}\n\nคำเตือน: ลิงก์นี้จะหมดอายุภายใน 15 นาที`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ error: 'ส่งอีเมลไม่สำเร็จ' });
        res.json({ message: 'ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลแล้ว' });
      });
    });
  });
});

//รับ token+pss ใหม่
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });

  db.get('SELECT * FROM PasswordResetTokens WHERE Token = ?', [token], async (err, tokenRow) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!tokenRow) return res.status(400).json({ error: 'Token ไม่ถูกต้อง' });

    if (Date.now() > tokenRow.Expiry) {
      return res.status(400).json({ error: 'Token หมดอายุแล้ว' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE AllUsers SET Password = ? WHERE Email = ?', [hashed, tokenRow.Email], (err) => {
      if (err) return res.status(500).json({ error: 'เปลี่ยนรหัสผ่านไม่สำเร็จ' });

      db.run('DELETE FROM PasswordResetTokens WHERE Token = ?', [token]);
      res.json({ message: 'รีเซ็ตรหัสผ่านสำเร็จแล้ว' });
    });
  });
});

//ส่งปัญหาผ่าน contact
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: 'settawat_na@customs.go.th',
      subject: `📩 Contact message from ${firstName} ${lastName}`,
      html: `
        <p><strong>ชื่อ:</strong> ${firstName} ${lastName}</p>
        <p><strong>อีเมลผู้ส่ง:</strong> ${email}</p>
        <p><strong>ข้อความ:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'ส่งอีเมลสำเร็จ' });
  } catch (err) {
    console.error('❌ Error sending email:', err);
    res.status(500).json({ error: 'ไม่สามารถส่งอีเมลได้' });
  }
});