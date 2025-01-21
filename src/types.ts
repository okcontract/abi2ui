export type EditorOptions = {
	view?: boolean;
	sectionClass?: string;
	noCollapsible?: boolean;
	hideLabels?: boolean;
	formatError?: (err: Error) => { type: "error" | "info"; message: string };
};

export type ModeType = "string" | "expr" | "img" | "color" | "coredata";

export type EditorGlobal = {
	[path: string]: unknown;
};
export type ErrorPathMap = { [path: string]: ErrorPathMapValue };
export type ErrorPathMapValue = Error | ErrorPathMap;

export type EditorPathMap = {
	[path: string]: EditorPathMapValue;
};
export type EditorPathMapValue = AdvancedInput | Input | EditorPathMap;

export interface EditorUpdate {
	v: unknown;
	parTy: unknown; // @todo
}

export type AdvancedInputPathMap = {
	[path: string]: AdvancedInput;
};
export type AdvancedInput = { mode: ModeType };
type Input = { value: string; touched: boolean };
type Error = { message: string };

// type guards

export const isAdvancedInput = (
	input: EditorPathMapValue,
): input is AdvancedInput => {
	return (input as AdvancedInput)?.mode !== undefined;
};
