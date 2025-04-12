from flask import Flask

app = Flask(__name__)

# default route
@app.route('/test')
def test():
    return {"text":"Hello World!"}


if __name__ == '__main__':
    app.run(debug=True)
    