from flask import Flask,jsonify
from flask_cors import CORS
import psutil
import subprocess
app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return jsonify({
        "message": "Jarvis Online (Whooooooooo...........)!"
    })
@app.route('/stats')
def get_stats():
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    memory_percent = memory.percent
    disk = psutil.disk_usage('/')
    disk_percent = disk.percent

    return jsonify({
        "CPU" : cpu_percent,
        "RAM" : memory_percent,
        "Disk" : disk_percent
    })

@app.route('/command/<action>',methods = ['GET','POST'])
def execute_command(action):
    if(action == 'lock'):
        subprocess.run(['loginctl','lock-session'])
        return jsonify({
            "status" : "Executed",
            "action" : "Locking System"
        })
    elif(action == 'sleep'):
        subprocess.run(['systemctl','suspend'])
        return jsonify({
            "status" : "Executed",
            "action" : "Putting System to Sleep"
        })
    else :
        return jsonify({
            "status" : "Failed",
            "action" : "Invalid Action"
        })






if __name__ == '__main__':
    app.run(host = "0.0.0.0",debug=True,port=5000)