def print_board(board):
    for row in range(3):
        print(" | ".join(board[row * 3: (row + 1) * 3]))
        if row < 2:
            print("---------")

def check_winner(board):
    win_positions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
        [0, 4, 8], [2, 4, 6]              # diagonals
    ]

    for positions in win_positions:
        a, b, c = positions
        if board[a] == board[b] == board[c] and board[a] != " ":
            return board[a]

    if " " not in board:
        return "Draw"
    return None

def make_move(board, position, player):
    if board[position] == " ":
        board[position] = player
        return True
    return False

def reset_board():
    return [" "] * 9

def main():
    board = reset_board()
    current_player = "X"
    winner = None

    while not winner:
        print_board(board)
        print(f"Player {current_player}'s turn. Enter position (0-8):")
        position = int(input())

        if 0 <= position < 9 and make_move(board, position, current_player):
            winner = check_winner(board)
            current_player = "O" if current_player == "X" else "X"
        else:
            print("Invalid move. Try again.")

    print_board(board)
    if winner == "Draw":
        print("The game is a draw.")
    else:
        print(f"Player {winner} wins!")

if __name__ == "__main__":
    main()
