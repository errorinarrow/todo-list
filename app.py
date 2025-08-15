from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'  # 專案根目錄會生成 todo.db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_AS_ASCII'] = False  # 讓 JSON 能輸出中文

db = SQLAlchemy(app)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'completed': self.completed,
            'created_at': self.created_at.isoformat()
        }

@app.route('/')
def index():
    # 單頁應用；前端用 fetch 呼叫底下 API
    return render_template('index.html')

# 取得任務清單
@app.get('/api/tasks')
def list_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tasks])

# 新增任務
@app.post('/api/tasks')
def create_task():
    data = request.get_json(silent=True) or {}
    title = (data.get('title') or '').strip()
    if not title:
        return jsonify({'error': 'title is required'}), 400
    if len(title) > 200:
        return jsonify({'error': 'title too long'}), 400

    t = Task(title=title)
    db.session.add(t)
    db.session.commit()
    return jsonify(t.to_dict()), 201

# 更新任務（可修改 title 與 completed）
@app.patch('/api/tasks/<int:task_id>')
def update_task(task_id):
    t = Task.query.get(task_id)
    if not t:
        return jsonify({'error': 'not found'}), 404

    data = request.get_json(silent=True) or {}
    if 'completed' in data:
        t.completed = bool(data['completed'])
    if 'title' in data:
        title = (data['title'] or '').strip()
        if not title:
            return jsonify({'error': 'title cannot be empty'}), 400
        if len(title) > 200:
            return jsonify({'error': 'title too long'}), 400
        t.title = title

    db.session.commit()
    return jsonify(t.to_dict())

# 切換完成狀態（提供簡單端點，方便用 checkbox）
@app.post('/api/tasks/<int:task_id>/toggle')
def toggle_task(task_id):
    t = Task.query.get(task_id)
    if not t:
        return jsonify({'error': 'not found'}), 404
    t.completed = not t.completed
    db.session.commit()
    return jsonify(t.to_dict())

# 刪除任務
@app.delete('/api/tasks/<int:task_id>')
def delete_task(task_id):
    t = Task.query.get(task_id)
    if not t:
        return jsonify({'error': 'not found'}), 404
    db.session.delete(t)
    db.session.commit()
    return jsonify({'ok': True})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # 首次啟動時建立資料表
    app.run(debug=True)
