import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import Button from "../../../Button";

describe("<Button />", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with title", () => {
    render(<Button onPress={mockOnPress} title="Test Button" />);

    expect(screen.getByText("Test Button")).toBeTruthy();
  });

  test("calls onPress when pressed", () => {
    render(<Button onPress={mockOnPress} title="Test Button" />);

    const button = screen.getByText("Test Button").parent;
    fireEvent.press(button!);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test("does not call onPress when disabled", () => {
    render(
      <Button onPress={mockOnPress} title="Test Button" disabled={true} />
    );

    const button = screen.getByText("Test Button").parent;
    fireEvent.press(button!);

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
