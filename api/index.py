from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid, hashlib, os, functools
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "taskflow-secret-2024")
CORS(app, origins=["*"])

USERS = {}
TASKS = {}
SESSIONS = {}

def hash_pw(p): return hashlib.sha256(p.encode()).hexdigest()

def auth_required(f):
    @functools.wraps(f)
    def wrap(*a, **kw):
        token = request.headers.get("X-Auth-Token")
        if not token or token not in SESSIONS:
            return jsonify({"error": "Unauthorized"}), 401
        request.user = SESSIONS[token]
        return f(*a, **kw)
    return wrap

@app.route("/api/register", methods=["POST"])
def register():
    d = request.get_json()
    u = d.get("username","").strip().lower()
    p = d.get("password","")
    n = d.get("name", u)
    if not u or not p: return jsonify({"error":"Required"}), 400
    if u in USERS: return jsonify({"error":"Username taken"}), 409
    if len(p) < 6: return jsonify({"error":"Min 6 chars"}), 400
    USERS[u] = {"id": str(uuid.uuid4()), "name": n, "password_hash": hash_pw(p)}
    t = str(uuid.uuid4())
    SESSIONS[t] = u
    return jsonify({"token": t, "user": {"username": u, "name": n}}), 201

@app.route("/api/login", methods=["POST"])
def login():
    d = request.get_json()
    u = d.get("username","").strip().lower()
    p = d.get("password","")
    user = USERS.get(u)
    if not user or user["password_hash"] != hash_pw(p):
        return jsonify({"error":"Invalid credentials"}), 401
    t = str(uuid.uuid4())
    SESSIONS[t] = u
    return jsonify({"token": t, "user": {"username": u, "name": user["name"]}})

@app.route("/api/logout", methods=["POST"])
@auth_required
def logout():
    SESSIONS.pop(request.headers.get("X-Auth-Token"), None)
    return jsonify({"message":"ok"})

@app.route("/api/me")
@auth_required
def me():
    u = USERS.get(request.user, {})
    return jsonify({"username": request.user, "name": u.get("name", request.user)})

@app.route("/api/tasks", methods=["GET"])
@auth_required
def get_tasks():
    ut = [t for t in TASKS.values() if t["owner"] == request.user]
    s = request.args.get("status")
    if s and s != "all": ut = [t for t in ut if t["status"] == s]
    ut.sort(key=lambda x: x["created_at"], reverse=True)
    return jsonify(ut)

@app.route("/api/tasks", methods=["POST"])
@auth_required
def create_task():
    d = request.get_json()
    title = d.get("title","").strip()
    if not title: return jsonify({"error":"Title required"}), 400
    task = {
        "id": str(uuid.uuid4()), "owner": request.user,
        "title": title, "description": d.get("description",""),
        "status": d.get("status","todo"), "priority": d.get("priority","medium"),
        "due_date": d.get("due_date"), "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    TASKS[task["id"]] = task
    return jsonify(task), 201

@app.route("/api/tasks/<tid>", methods=["PUT"])
@auth_required
def update_task(tid):
    task = TASKS.get(tid)
    if not task or task["owner"] != request.user:
        return jsonify({"error":"Not found"}), 404
    d = request.get_json()
    for f in ["title","description","status","priority","due_date"]:
        if f in d: task[f] = d[f]
    task["updated_at"] = datetime.utcnow().isoformat()
    return jsonify(task)

@app.route("/api/tasks/<tid>", methods=["DELETE"])
@auth_required
def delete_task(tid):
    task = TASKS.get(tid)
    if not task or task["owner"] != request.user:
        return jsonify({"error":"Not found"}), 404
    del TASKS[tid]
    return jsonify({"message":"deleted"})

@app.route("/api/tasks/stats")
@auth_required
def stats():
    ut = [t for t in TASKS.values() if t["owner"] == request.user]
    return jsonify({
        "total": len(ut),
        "todo": sum(1 for t in ut if t["status"]=="todo"),
        "in_progress": sum(1 for t in ut if t["status"]=="in_progress"),
        "done": sum(1 for t in ut if t["status"]=="done")
    })

@app.route("/api/health")
def health(): return jsonify({"status":"ok"})
