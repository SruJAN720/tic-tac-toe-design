from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

game_state = {
    "board": [''] * 9,
    "is_x_next": True,
    "winner": None,
    "is_single_player": False
}

def check_winner(board):
    winning_combinations = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),  # horizontal
        (0, 3, 6), (1, 4, 7), (2, 5, 8),  # vertical
        (0, 4, 8), (2, 4, 6)  # diagonal
    ]

    for a, b, c in winning_combinations:
        if board[a] and board[a] == board[b] == board[c]:
            return board[a]
    if all(board):
        return 'Draw'
    return None

def computer_move(board):
    available_moves = [i for i, x in enumerate(board) if x == '']
    if available_moves:
        return random.choice(available_moves)
    return None

@app.route('/game', methods=['GET'])
def get_game():
    return jsonify(game_state)

@app.route('/move', methods=['POST'])
def make_move():
    global game_state
    data = request.json
    index = data['index']
    
    if game_state['board'][index] or game_state['winner']:
        return jsonify(game_state)

    game_state['board'][index] = 'X' if game_state['is_x_next'] else 'O'
    game_state['is_x_next'] = not game_state['is_x_next']
    game_state['winner'] = check_winner(game_state['board'])

    if game_state['is_single_player'] and not game_state['winner'] and not game_state['is_x_next']:
        comp_index = computer_move(game_state['board'])
        if comp_index is not None:
            game_state['board'][comp_index] = 'O'
            game_state['is_x_next'] = not game_state['is_x_next']
            game_state['winner'] = check_winner(game_state['board'])

    return jsonify(game_state)

@app.route('/reset', methods=['POST'])
def reset_game():
    global game_state
    game_state = {
        "board": [''] * 9,
        "is_x_next": True,
        "winner": None,
        "is_single_player": False
    }
    return jsonify(game_state)

@app.route('/set_mode', methods=['POST'])
def set_mode():
    global game_state
    data = request.json
    game_state['is_single_player'] = data['is_single_player']
    return jsonify(game_state)

if __name__ == '__main__':
    app.run(debug=True)
