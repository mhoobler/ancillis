import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectSegments from "./ProjectSegments";

const testProps = [
  {
    type: "LIMB",
    name: "Limb1",
  },
  {
    type: "SOCKET",
    name: "Socket1",
  },
  {
    type: "DOUBLE_SOCKET",
    name: "DoubleSocket1",
  },
];

test("renders all components", () => {
  render(<ProjectSegments components={testProps} />);
  const limb = screen.getByText("Limb1");
  const socket = screen.getByText("Socket1");
  const doubleSocket = screen.getByText("DoubleSocket1");

  expect(limb).toBeInTheDocument();
  expect(socket).toBeInTheDocument();
  expect(doubleSocket).toBeInTheDocument();
});
