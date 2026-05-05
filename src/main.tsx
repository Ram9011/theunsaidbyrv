/// <reference types="@tanstack/react-start/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
});

hydrateRoot(document.getElementById("root")!, <StartClient router={router} />);
