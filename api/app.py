import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json

load_dotenv()

app = Flask(__name__)
# app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app)
# http://localhost:3000

connection = psycopg2.connect(
    host=os.environ.get("db_host"),
    database=os.environ.get("database"),
    user=os.environ.get("db_user"),
    password=os.environ.get("db_password")
)
connection.autocommit = True
cursor = connection.cursor()

@app.route("/api/events", methods=["GET"])
def get_events():
    EVENTS = (
        """SELECT * FROM events WHERE end_date > NOW();"""
    )
    # with connection:
    #     with connection.cursor() as cursor:
    #         cursor.execute(EVENTS)
    #         all_events = cursor.fetchall()
    cursor.execute(EVENTS)
    all_events = cursor.fetchall()
    return {"events": all_events}

@app.route("/api/auth", methods=["POST"])
def verify_credentials():
    print("hello")
    request_data = request.get_json()
    email = request_data['email']
    hash_pass = request_data['pass']
    USER = (
        """SELECT * FROM users WHERE email = (%s) AND hash_pass = (%s);"""
    )
    print(email)
    print(hash_pass)
    # with connection:
    #     with connection.cursor() as cursor:
    #         cursor.execute(USER, (email, hash_pass))
    #         result = cursor.fetchall()
    cursor.execute(USER, (email, hash_pass))
    result = cursor.fetchall()
    return {
        "success": not not len(result),
        "data": result
    }

@app.route("/api/user/events", methods=["GET"])
def get_events_for_user():
    # request_data = request.get_json()
    # user_id = request_data['user_id']
    user_id = request.args.get('user_id')
    BOOKINGS = (
        """SELECT COUNT(*), SUM(seats) FROM bookings WHERE user_id = (%s);"""
    )
    PAYMENTS = (
        """SELECT SUM(B.seats * S.price) as Total_payment
            FROM Users U, Bookings B, Event_shows S
            WHERE U.user_id = B.user_id AND B.show_id = S.show_id AND U.user_id = (%s)
            GROUP BY U.user_id;
        """
    )
    RENT = (
        """SELECT SUM(R.rent_price) as Total_rent_payment
            FROM Users U, Purchase P, Event_on_rent R
            WHERE U.user_id = P.user_id AND P.rent_id = R.rent_id AND U.user_id = (%s)
            GROUP BY U.user_id;
        """
    )
    UPCOMING_EVENTS = (
        """SELECT DISTINCT S.show_date, S.event_venue_id, EV.venue_name, EV.address, E.event_name, E.rating, B.seats
            FROM Users U, Bookings B, Event_shows S, Event_venues as EV, Events as E
            WHERE U.user_id = B.user_id AND B.show_id = S.show_id 
            AND U.user_id = (%s) AND EV.venue_id = S.event_venue_id 
            AND S.show_date > NOW() AND E.event_id = S.event_id LIMIT 3;
        """
    )
    # with connection:
    #     with connection.cursor() as cursor:
    #         cursor.execute(BOOKINGS, (user_id,))
    #         booking_result = cursor.fetchall()
    #         cursor.execute(PAYMENTS, (user_id,))
    #         payments_result = cursor.fetchall()
    #         cursor.execute(RENT, (user_id,))
    #         rent_result = cursor.fetchall()
    #         cursor.execute(UPCOMING_EVENTS, (user_id,))
    #         upcoming_events = cursor.fetchall()
    cursor.execute(BOOKINGS, (user_id,))
    booking_result = cursor.fetchall()
    cursor.execute(PAYMENTS, (user_id,))
    payments_result = cursor.fetchall()
    cursor.execute(RENT, (user_id,))
    rent_result = cursor.fetchall()
    cursor.execute(UPCOMING_EVENTS, (user_id,))
    upcoming_events = cursor.fetchall()
    return {
        "success": not not len(booking_result) and not not len(payments_result),
        "bookings": booking_result,
        "payments": payments_result,
        "rent": rent_result if len(rent_result) else 0,
        "upcoming_events": upcoming_events,
    }


@app.route("/api/user/event_distribution_by_category", methods=["GET"])
def get_event_distribution_by_category_for_user():
    # request_data = request.get_json()
    # user_id = request_data['user_id']
    user_id = request.args.get('user_id')
    
    EVENTS = (
        """SELECT E.event_type, count(*) 
            FROM Events E, Event_shows S, Bookings B
            WHERE B.user_id = (%s) AND B.show_id = S.show_id 
            AND S.event_id = E.event_id
            GROUP BY E.event_type ORDER BY E.event_type DESC;
        """
    )
    # with connection:
    #     with connection.cursor() as cursor:
    #         cursor.execute(EVENTS, (user_id,))
    #         events = cursor.fetchall()
    cursor.execute(EVENTS, (user_id,))
    events = cursor.fetchall()
    return {
        "success": not not len(events),
        "events": events,
    }

@app.route("/api/user/event_by_category", methods=["GET"])
def get_event_by_category_for_user():
    # request_data = request.get_json()
    # user_id = request_data['user_id']
    user_id = request.args.get('user_id')
    event_type = request.args.get('event_type')
    
    EVENTS = (
        # """SELECT E.event_name, E.event_type, E.duration, C.company_name 
        #     FROM Events E, Event_shows S, Bookings B, Event_organizer O, Company C
        #     WHERE B.user_id = (%s) AND B.show_id = S.show_id 
        #     AND S.event_id = E.event_id AND E.event_type = (%s)
        #     AND E.event_creater = O.user_id AND O.company_id = C.company_id;
        # """
        """SELECT E.event_name, E.event_type, E.duration, U.full_name 
            FROM Events E, Event_shows S, Bookings B, Users U
            WHERE B.user_id = (%s) AND B.show_id = S.show_id 
            AND S.event_id = E.event_id AND E.event_type = (%s)
            AND E.event_creater = U.user_id;
        """
    )
    # with connection:
    #     with connection.cursor() as cursor:
    #         cursor.execute(EVENTS, (user_id, event_type))
    #         events = cursor.fetchall()
    cursor.execute(EVENTS, (user_id, event_type))
    events = cursor.fetchall()
    return {
        "success": not not len(events),
        "events": events,
    }

@app.route("/api/user/events_list", methods=["GET"])
def get_all_available_events_for_user():
    # request_data = request.get_json()
    # user_id = request_data['user_id']
    user_id = request.args.get('user_id')
    
    EVENTS = (
        """SELECT DISTINCT E.event_name, E.event_type, CONCAT_WS(', ',V.venue_name, V.address), S.show_date, S.start_time, E.duration, S.price, S.available_seats, E.rating, S.show_id
            FROM Bookings B, event_shows S, Events E, Event_venues V
            WHERE B.user_id = (%s) AND S.show_id <> B.show_id
            AND S.event_id = E.event_id AND S.available_seats IS NOT NULL
            AND S.event_venue_id = V.venue_id
            AND show_date > NOW();
        """
    )
    # with connection:
    #     with connection.cursor() as cursor:
    #         cursor.execute(EVENTS, (user_id,))
    #         events = cursor.fetchall()
    cursor.execute(EVENTS, (user_id,))
    events = cursor.fetchall()
            # events = [list(r) for r in events]
    events = json.dumps(events, default=str)
    return {
        "success": not not len(events),
        "events": events,
    }

@app.route("/api/user/book_event", methods=["POST"])
def book_event_for_user():
    # request_data = request.get_json()
    # user_id = request_data['user_id']
    request_data = request.get_json()
    user_id = request_data['user_id']
    show_id = request_data['show_id']
    seats = request_data['seats']
    
    EVENTS = (
        """ INSERT INTO Bookings VALUES((SELECT MAX(booking_id) + 1 FROM Bookings) ,%s, %s, %s) RETURNING booking_id;
        """
    )
    try:
        # with connection:
        #     with connection.cursor() as cursor:
        #         cursor.execute(EVENTS, (user_id, show_id, seats))
        #         events = cursor.fetchall()
        cursor.execute(EVENTS, (user_id, show_id, seats))
        # connection.commit()
        events = cursor.fetchall()
        return {
            "success": not not len(events),
            "events": events,
        }
    except Exception as e:
        print("Exception:  \n",str(e))
        return {
            "success": False,
            "error": str(e),
        }
    