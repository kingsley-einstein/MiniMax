import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

class Move {
  private Integer r = 0;
  private Integer c = 0;

  public Move(Integer r, Integer c) {
    this.r = r;
    this.c = c;
  }

  public Integer getR() {
    return r;
  }

  public Integer getC() {
    return c;
  }
}

class Node {
  private Move m = null;
  private Integer value = 0;

  public Node(Move m, Integer value) {
    this.m = m;
    this.value = value;
  }

  public Move getMove() {
    return m;
  }

  public Integer getValue() {
    return value;
  }
}

class Board {
  private static int[][] cells = new int[3][3];
  private static List<Move> availableMoves = new ArrayList<>();
  private static List<Node> nodes = new ArrayList<>();
  private static Character[][] points = new Character[3][3];

  static void placeMove(Move m, Integer i) {
    cells[m.getR()][m.getC()] = i;
  }

  static List<Move> getAvailableMoves() {
    if (availableMoves.size() > 0) {
      availableMoves.clear();
    }
    for (int i = 0; i < 3; i++) {
      for (int j = 0; j < 3; j++) {
        if (cells[i][j] == 0) {
          availableMoves.add(new Move(i, j));
        }
      }
    }
    return availableMoves;
  }

  static Boolean xHasWon() {
    for (int i = 0; i < 3; i++) {
      if (cells[i][0] == cells[i][1] && cells[i][1] == cells[i][2] && cells[i][2] == 1) {
        return true;
      }
      if (cells[0][i] == cells[1][i] && cells[1][i] == cells[2][i] && cells[2][i] == 1) {
        return true;
      }
    }
    if ((cells[0][0] == cells[1][1] && cells[1][1] == cells[2][2] && cells[2][2] == 1) || (cells[0][2] == cells[1][1] && cells[1][1] == cells[2][0] && cells[2][0] == 1)) {
      return true;
    }
    return false;
  }

  static Boolean oHasWon() {
    for (int i = 0; i < 3; i++) {
      if (cells[i][0] == cells[i][1] && cells[i][1] == cells[i][2] && cells[i][2] == -1) {
        return true;
      }
      if (cells[0][i] == cells[1][i] && cells[1][i] == cells[2][i] && cells[2][i] == -1) {
        return true;
      }
    }
    if ((cells[0][0] == cells[1][1] && cells[1][1] == cells[2][2] && cells[2][2] == -1) || (cells[0][2] == cells[1][1] && cells[1][1] == cells[2][0] && cells[2][0] == -1)) {
      return true;
    }
    return false;
  }

  static Boolean gameIsOver() {
    return (xHasWon() || oHasWon() || getAvailableMoves().isEmpty());
  }

  static Integer minimax(Integer depth, Boolean isMaximizer) {
    Integer maxEval = Integer.MIN_VALUE;
    Integer minEval = Integer.MAX_VALUE;
    if (getAvailableMoves().isEmpty()) {
      return 0;
    }
    if (xHasWon()) {
      return 1;
    }
    if (oHasWon()) {
      return -1;
    }
    if (isMaximizer) {
      for (int i = 0; i < getAvailableMoves().size(); i++) {
        Move m = getAvailableMoves().get(i);
        placeMove(m, 1);
        Integer eval = minimax(depth + 1, false);
        maxEval = Math.max(maxEval, eval);
        if (depth == 0) {
          nodes.add(new Node(m, maxEval));
        }
        placeMove(m, 0);
      }
    } else {
      for (int i = 0; i < getAvailableMoves().size(); i++) {
        Move m = getAvailableMoves().get(i);
        placeMove(m, -1);
        Integer eval = minimax(depth + 1, true);
        minEval = Math.min(minEval, eval);
        if (depth == 0) {
          nodes.add(new Node(m, minEval));
        }
        placeMove(m, 0);
      }
    }
    return isMaximizer ? maxEval : minEval;
  }

  static Move getBestMove() {
    Integer max = Integer.MIN_VALUE;
    Integer index = 0;
    for (int i = 0; i < nodes.size(); i++) {
      Node n = nodes.get(i);
      if (max < n.getValue()) {
        max = n.getValue();
        index = i;
      }
    }
    return nodes.get(index).getMove();
  }

  static void callMinimax(Integer depth, Boolean isMaximizer) {
    nodes.clear();
    minimax(depth, isMaximizer);
  }

  static void showBoard() {
    for (int i = 0; i < cells.length; i++) {
      for (int j = 0; j < cells.length; j++) {
        if (cells[i][j] == 0) {
          points[i][j] = '-';
        }
        if (cells[i][j] == 1) {
          points[i][j] = 'X';
        }
        if (cells[i][j] == -1) {
          points[i][j] = 'O';
        }
        System.out.printf("[ %s ]", points[i][j]);
      }
      System.out.println();
    }
  }

  static void showHint() {
    for (int i = 0; i < cells.length; i++) {
      for (int j =0; j < cells.length; j++) {
        System.out.printf("[ %d  %d ]", i + 1, j + 1);
      }
      System.out.println();
    }
  }

  static void startGame() {
    System.out.println("Welcome to the Tic-Tac-Toe game \n Author: Kingsley Victor \n");
    showBoard();
    showHint();
    System.out.println("\n To place a mark, enter the corresponding row and column value \n");
    Scanner gameInput = new Scanner(System.in);
    System.out.println("\n Who plays first?  Computer (1), User (2) \n");
    Integer choice = gameInput.nextInt();
    while (choice < 1 || choice > 2) {
      System.out.println("Invalid choice");
      choice = gameInput.nextInt();
    }
    if (choice == 1) {
      Random random = new Random();
      Move m = new Move(random.nextInt(3), random.nextInt(3));
      placeMove(m, 1);
      showBoard();
      showHint();
    }
    while (!gameIsOver()) {
      System.out.println("Make your move \n \n");
      Integer r = gameInput.nextInt() - 1;
      Integer c = gameInput.nextInt() - 1;
      Move m = new Move(r, c);
      while (cells[m.getR()][m.getC()] != 0) {
        System.out.println("Invalid move. Cell already occupied \n \n");
        r = gameInput.nextInt() - 1;
        c = gameInput.nextInt() - 1;
        m = new Move(r, c);
      }
      placeMove(m, -1);
      showBoard();
      callMinimax(0, true);
      if (gameIsOver()) {
        System.out.println();
        showBoard();
        break;
      }
      try {
        System.out.println();
        System.out.println("Wait! Computer is thinking");
        System.out.println();
        Thread.sleep(2000);
      } catch (InterruptedException e) {
        System.out.println(e.getMessage());
      }
      placeMove(getBestMove(), 1);
      showBoard();
      if (!gameIsOver()) {
        showHint();
      }
    }
    if (xHasWon()) {
      System.out.println("Computer wins the game");
    }
    if (oHasWon()) {
      System.out.println("You win the game");
    }
    if (getAvailableMoves().isEmpty() && !xHasWon() && !oHasWon()) {
      System.out.println("It's a tie");
    }
  }
}

public class Game {
  public static void main(String[] args) {
    Board.startGame();
  }
}
