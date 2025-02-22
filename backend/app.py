from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import bcrypt
import pickle
import pandas as pd

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MySQL configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  
app.config['MYSQL_PASSWORD'] = 'CP048048'  
app.config['MYSQL_DB'] = 'recommendation_system'

mysql = MySQL(app)

# Load models and data
with open('content_based_model.pkl', 'rb') as f:
    content_based_components = pickle.load(f)
    tfidf = content_based_components['tfidf_vectorizer']
    cosine_sim = content_based_components['cosine_sim']
    content_scaler = content_based_components['content_scaler']

with open('collab_filter_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('dataset.pkl', 'rb') as f:
    df = pickle.load(f)

# Helper function to hash passwords
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Helper function to verify passwords
def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

def find_product_id_by_title(title):
    # Find products whose titles contain the search term (case-insensitive)
    matches = df[df['title'].str.contains(title, case=False, na=False)]
    if not matches.empty:
        return matches.iloc[0]['asin']  # Return the first match's product_id
    return None

# Function to get content-based recommendations
def get_recommendations(product_id, cosine_sim_matrix, df, top_n=5):
    product_index = df[df['asin'] == product_id].index[0]
    sim_scores = list(enumerate(cosine_sim_matrix[product_index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:top_n+1]
    product_indices = [i[0] for i in sim_scores]
    return df[['asin', 'title', 'brand', 'rating', 'image_url']].iloc[product_indices]

# Function to get collaborative filtering recommendations
def get_collaborative_recommendations(user_id, model, df, top_n=5):
    all_product_ids = df['asin'].unique()
    interacted_products = df[df['user_id'] == user_id]['asin'].unique()
    recommendations = []
    for product_id in all_product_ids:
        if product_id not in interacted_products:
            predicted_rating = model.predict(user_id, product_id).est
            recommendations.append((product_id, predicted_rating))
    recommendations.sort(key=lambda x: x[1], reverse=True)
    top_recommendations = recommendations[:top_n]
    return df[df['asin'].isin([x[0] for x in top_recommendations])][['asin', 'title', 'brand', 'rating', 'image_url']].drop_duplicates()

# Function to get hybrid recommendations
def get_hybrid_recommendations(user_id, product_id, df, model, cosine_sim, content_scaler, top_n=5):
    content_recs = get_recommendations(product_id, cosine_sim, df, top_n=top_n)
    collab_recs = get_collaborative_recommendations(user_id, model, df, top_n=top_n)
    hybrid_recs = pd.concat([content_recs, collab_recs]).drop_duplicates().head(top_n)
    return hybrid_recs

# User registration endpoint
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Hash the password
        hashed_password = hash_password(password)

        # Insert user into the database
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# User login endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Fetch user from the database
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, password FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        cur.close()

        if user and verify_password(password, user[1].encode('utf-8')):
            return jsonify({"message": "Login successful", "user_id": user[0]}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Recommendation endpoint (requires user_id)
@app.route('/recommend', methods=['GET'])
def recommend():
    try:
        user_id = int(request.args.get('user_id'))
        product_title = request.args.get('product_title')
        top_n = int(request.args.get('top_n', 5))

        # Find product_id by title
        product_id = find_product_id_by_title(product_title)
        if not product_id:
            return jsonify({"error": "Product not found"}), 404

        # Get hybrid recommendations
        recommendations = get_hybrid_recommendations(user_id, product_id, df, model, cosine_sim, content_scaler, top_n=top_n)
        return jsonify(recommendations.to_dict(orient='records'))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)