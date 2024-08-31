from dotenv import load_dotenv
load_dotenv()
from flask import Flask, render_template, request, redirect, flash, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from flask_bcrypt import Bcrypt
import os
from flask_mail import Mail, Message
from random import randint

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SECRET_KEY"] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

bcrypt = Bcrypt(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

mail = Mail(app)


class UserData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(250), nullable=False, unique=True)
    password = db.Column(db.String(250), nullable=False)

with app.app_context():
    db.create_all()

otp = randint(1000, 9999)  # Generate a new OTP

@app.route("/")
def hello_world():
    username = session.get('username')
    return render_template('index.html', username=username)

@app.route("/logIn", methods=["GET", "POST"])
def logIn():
    if request.method == "POST":
        user = UserData.query.filter_by(email=request.form["email-id"]).first()
        if user and bcrypt.check_password_hash(user.password, request.form["password"]):
            session['username'] = request.form["email-id"]  
            flash("You have successfully signed in!", "success")
            return redirect("/")
        else:
            flash("Invalid email or password. Please try again.", "danger")
    
    return render_template("logIn.html")

@app.route("/signUp", methods=['GET', 'POST'])
def signUp():
    if request.method == 'POST':
        email = request.form["email-id"]
        password = request.form["password"]
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = UserData(email=email, password=hashed_password)
        try:
            db.session.add(user)
            db.session.commit()
            flash("Account created successfully! Please log in.", "success")
            return redirect("logIn")
        except IntegrityError:
            db.session.rollback()
            flash("An account with this email already exists. Please log in.", "danger")
            return redirect("/logIn")
    return render_template('sign-up.html')

@app.route("/logOut")
def logOut():
    session.clear()
    flash("You have successfully logged out.", "success")
    return redirect("/logIn")

@app.route("/breakout_game")
def breakout_game():
    return render_template('Breakout_Game.html')

@app.route("/memory_game")
def memory_game():
    return render_template('memory_game.html')

@app.route("/frogger_game")
def frogger_game():
    return render_template('frogger.html')

@app.route("/whac-a-mole")
def whac_a_mole():
    return render_template('whac-a-mole.html')


@app.route("/space-invaders")
def space_invaders():
    return render_template('space-invaders.html')

@app.route("/connect-4")
def connect_4():
    return render_template('connect-4.html')


@app.route("/forgot-password", methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        if 'otp' not in session:
            # First, generate and send OTP
            usermail = request.form.get("email-id")
            if usermail:
                otp = randint(1000, 9999)  # Generate a new OTP
                session['otp'] = otp  # Store OTP in session
                session['email'] = usermail  # Store email in session
                session['username'] = usermail
                msg = Message('Password Reset', 
                              sender=os.getenv('MAIL_USERNAME'), 
                              recipients=[usermail])
                msg.body = f'Your One Time Password (OTP) is: {otp}. Do not share your OTP with anyone.'
                mail.send(msg)
                
                flash("An email with the OTP has been sent. Please check your email.", "success")
                return render_template('forgot_password.html', otp_sent=True)
            else:
                flash("Please enter a valid email address.", "danger")
                return render_template('forgot_password.html', otp_sent=False)
        else:
            # Verify the OTP
            user_otp = request.form.get("otp")
            if user_otp and user_otp.isdigit() and int(user_otp) == session.get('otp'):
                # OTP is correct, allow password reset
                flash("OTP verified successfully.", "success")
                # Clear the OTP from the session after successful verification
                session.pop('otp', None)
                return redirect("/")
            else:
                flash("Invalid OTP. Please try again.", "danger")
                return render_template('forgot_password.html', otp_sent=True)
    
    # If the request is GET, just render the forgot password page
    return render_template('forgot_password.html', otp_sent=False)

if __name__ == '__main__':
    app.run(debug=True)