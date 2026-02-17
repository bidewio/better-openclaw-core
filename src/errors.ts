/**
 * Typed error classes for stack generation.
 */

/** Thrown when the resolved stack configuration is invalid (e.g. conflicts). */
export class StackConfigError extends Error {
	readonly code = "STACK_CONFIG_ERROR" as const;

	constructor(message: string) {
		super(message);
		this.name = "StackConfigError";
	}
}

/** Thrown when post-generation validation fails. */
export class ValidationError extends Error {
	readonly code = "VALIDATION_ERROR" as const;

	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}
