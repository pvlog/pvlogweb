from flask.templating import render_template
from pvlogweb import app

@app.route('/about')
def about():
    """Render the about page
    :return: about page
    """
    return render_template("about.html")