% Define symbolic variables
syms x y

% Define the polynomials
f1 = x^2 + y^2 - 1; % Circle of radius 1
f2 = x^3 - y;       % Cubic curve

% Solve the system of polynomial equations
solutions = solve([f1 == 0, f2 == 0], [x, y]);

% Display the solutions
disp(solutions.x);
disp(solutions.y);

% Create a grid of points for visualization
[X, Y] = meshgrid(linspace(-2, 2, 100), linspace(-2, 2, 100));

% Evaluate the polynomials on the grid
Z1 = X.^2 + Y.^2 - 1;
Z2 = X.^3 - Y;

% Plot the algebraic varieties
figure;
hold on;
contour(X, Y, Z1, [0 0], 'r', 'LineWidth', 2); % Circle
contour(X, Y, Z2, [0 0], 'b', 'LineWidth', 2); % Cubic curve
xlabel('x');
ylabel('y');
title('Algebraic Varieties: Circle and Cubic Curve');
legend('x^2 + y^2 - 1 = 0', 'x^3 - y = 0');
grid on;
hold off;
