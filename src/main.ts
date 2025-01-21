import { mount } from "svelte";

import { type AppID, OKCore, baseOptions } from "@okcontract/sdk";

import App from "./App.svelte";
import "./assets/app.css";

const id = "abi2ui" as AppID;
const options = {
	...baseOptions(id),
};
const core = new OKCore(options);

const app = mount(App, {
	target: document.getElementById("app"),
	props: { core },
});

export default app;
