import {default as to} from "await-to-js";
import { CmdAction, ShellAction } from "./types/config";
import * as pcp from "promisify-child-process";

function isCmdAction(action: CmdAction | ShellAction): action is CmdAction {
	return "cmd" in action;
}

export async function startup(startupList: (CmdAction | ShellAction)[]) {
	let err;
	for (let action of startupList) {
		if (isCmdAction(action)) {
			[err] = await to(pcp.spawn(action.cmd[0], action.cmd.slice(1), {env: process.env}));
			if (err) {
				err = err as any;
				err.hint = action.hint;
				throw err;
			}
		} else {
			[err] = await to(pcp.spawn(action.script, [], {shell: action.shell, env: process.env}));
			if (err) {
				err = err as any;
				err.hint = action.hint;
				throw err;
			}
		}
	}
}