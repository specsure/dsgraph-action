import { createRequire } from "node:module";
import { appendFile, readFile, readdir, stat } from "node:fs/promises";
import { basename, dirname, join, posix, relative, resolve, sep } from "node:path";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
//#endregion
//#region ../dsgraph-schema/dist/canonical.js
/**
* Canonical JSON (RFC 8785 style): object keys sorted by UTF-16 code units,
* no insignificant whitespace, numbers rounded to 6 decimal places first.
*/
const PRECISION = 1e6;
/** Rounds a number to 6 decimal places; normalizes -0 to 0. */
function roundNumber(n) {
	if (!Number.isFinite(n)) return n;
	const r = Math.round(n * PRECISION) / PRECISION;
	return Object.is(r, -0) ? 0 : r;
}
/** Returns a deep copy where every number is rounded and object keys are sorted. */
function normalize(value) {
	if (typeof value === "number") return roundNumber(value);
	if (Array.isArray(value)) return value.map(normalize);
	if (value !== null && typeof value === "object") {
		const out = {};
		for (const key of Object.keys(value).sort()) {
			const v = value[key];
			if (v !== void 0) out[key] = normalize(v);
		}
		return out;
	}
	return value;
}
function canonicalize(value) {
	return JSON.stringify(normalize(value));
}
async function sha256Hex(text) {
	const data = new TextEncoder().encode(text);
	const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
/** Hash of a snapshot or changeset: sha256 of canonical JSON without `hash` and `meta`. */
async function contentHash(doc) {
	const { hash: _hash, meta: _meta, ...rest } = doc;
	return `sha256:${await sha256Hex(canonicalize(rest))}`;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/guard/value.mjs
/** Returns true if this value is an async iterator */
function IsAsyncIterator$3(value) {
	return IsObject$3(value) && !IsArray$3(value) && !IsUint8Array$3(value) && Symbol.asyncIterator in value;
}
/** Returns true if this value is an array */
function IsArray$3(value) {
	return Array.isArray(value);
}
/** Returns true if this value is bigint */
function IsBigInt$3(value) {
	return typeof value === "bigint";
}
/** Returns true if this value is a boolean */
function IsBoolean$3(value) {
	return typeof value === "boolean";
}
/** Returns true if this value is a Date object */
function IsDate$3(value) {
	return value instanceof globalThis.Date;
}
/** Returns true if this value is a function */
function IsFunction$3(value) {
	return typeof value === "function";
}
/** Returns true if this value is an iterator */
function IsIterator$3(value) {
	return IsObject$3(value) && !IsArray$3(value) && !IsUint8Array$3(value) && Symbol.iterator in value;
}
/** Returns true if this value is null */
function IsNull$3(value) {
	return value === null;
}
/** Returns true if this value is number */
function IsNumber$3(value) {
	return typeof value === "number";
}
/** Returns true if this value is an object */
function IsObject$3(value) {
	return typeof value === "object" && value !== null;
}
/** Returns true if this value is RegExp */
function IsRegExp$2(value) {
	return value instanceof globalThis.RegExp;
}
/** Returns true if this value is string */
function IsString$3(value) {
	return typeof value === "string";
}
/** Returns true if this value is symbol */
function IsSymbol$3(value) {
	return typeof value === "symbol";
}
/** Returns true if this value is a Uint8Array */
function IsUint8Array$3(value) {
	return value instanceof globalThis.Uint8Array;
}
/** Returns true if this value is undefined */
function IsUndefined$3(value) {
	return value === void 0;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/clone/value.mjs
function ArrayType$1(value) {
	return value.map((value) => Visit$5(value));
}
function DateType$1(value) {
	return new Date(value.getTime());
}
function Uint8ArrayType$1(value) {
	return new Uint8Array(value);
}
function RegExpType(value) {
	return new RegExp(value.source, value.flags);
}
function ObjectType$1(value) {
	const result = {};
	for (const key of Object.getOwnPropertyNames(value)) result[key] = Visit$5(value[key]);
	for (const key of Object.getOwnPropertySymbols(value)) result[key] = Visit$5(value[key]);
	return result;
}
function Visit$5(value) {
	return IsArray$3(value) ? ArrayType$1(value) : IsDate$3(value) ? DateType$1(value) : IsUint8Array$3(value) ? Uint8ArrayType$1(value) : IsRegExp$2(value) ? RegExpType(value) : IsObject$3(value) ? ObjectType$1(value) : value;
}
/** Clones a value */
function Clone(value) {
	return Visit$5(value);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/clone/type.mjs
/** Clones a Type */
function CloneType(schema, options) {
	return options === void 0 ? Clone(schema) : Clone({
		...options,
		...schema
	});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/value/guard/guard.mjs
/** Returns true if this value is an async iterator */
function IsAsyncIterator$2(value) {
	return IsObject$2(value) && globalThis.Symbol.asyncIterator in value;
}
/** Returns true if this value is an iterator */
function IsIterator$2(value) {
	return IsObject$2(value) && globalThis.Symbol.iterator in value;
}
/** Returns true if this value is a Promise */
function IsPromise$2(value) {
	return value instanceof globalThis.Promise;
}
/** Returns true if this value is a Date */
function IsDate$2(value) {
	return value instanceof Date && globalThis.Number.isFinite(value.getTime());
}
/** Returns true if the value is a Uint8Array */
function IsUint8Array$2(value) {
	return value instanceof globalThis.Uint8Array;
}
/** Returns true of this value is an object type */
function IsObject$2(value) {
	return value !== null && typeof value === "object";
}
/** Returns true if this value is an array, but not a typed array */
function IsArray$2(value) {
	return globalThis.Array.isArray(value) && !globalThis.ArrayBuffer.isView(value);
}
/** Returns true if this value is an undefined */
function IsUndefined$2(value) {
	return value === void 0;
}
/** Returns true if this value is an null */
function IsNull$2(value) {
	return value === null;
}
/** Returns true if this value is an boolean */
function IsBoolean$2(value) {
	return typeof value === "boolean";
}
/** Returns true if this value is an number */
function IsNumber$2(value) {
	return typeof value === "number";
}
/** Returns true if this value is an integer */
function IsInteger$2(value) {
	return globalThis.Number.isInteger(value);
}
/** Returns true if this value is bigint */
function IsBigInt$2(value) {
	return typeof value === "bigint";
}
/** Returns true if this value is string */
function IsString$2(value) {
	return typeof value === "string";
}
/** Returns true if this value is a function */
function IsFunction$2(value) {
	return typeof value === "function";
}
/** Returns true if this value is a symbol */
function IsSymbol$2(value) {
	return typeof value === "symbol";
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/system/policy.mjs
var TypeSystemPolicy;
(function(TypeSystemPolicy) {
	/**
	* Configures the instantiation behavior of TypeBox types. The `default` option assigns raw JavaScript
	* references for embedded types, which may cause side effects if type properties are explicitly updated
	* outside the TypeBox type builder. The `clone` option creates copies of any shared types upon creation,
	* preventing unintended side effects. The `freeze` option applies `Object.freeze()` to the type, making
	* it fully readonly and immutable. Implementations should use `default` whenever possible, as it is the
	* fastest way to instantiate types. The default setting is `default`.
	*/
	TypeSystemPolicy.InstanceMode = "default";
	/** Sets whether TypeBox should assert optional properties using the TypeScript `exactOptionalPropertyTypes` assertion policy. The default is `false` */
	TypeSystemPolicy.ExactOptionalPropertyTypes = false;
	/** Sets whether arrays should be treated as a kind of objects. The default is `false` */
	TypeSystemPolicy.AllowArrayObject = false;
	/** Sets whether `NaN` or `Infinity` should be treated as valid numeric values. The default is `false` */
	TypeSystemPolicy.AllowNaN = false;
	/** Sets whether `null` should validate for void types. The default is `false` */
	TypeSystemPolicy.AllowNullVoid = false;
	/** Checks this value using the ExactOptionalPropertyTypes policy */
	function IsExactOptionalProperty(value, key) {
		return TypeSystemPolicy.ExactOptionalPropertyTypes ? key in value : value[key] !== void 0;
	}
	TypeSystemPolicy.IsExactOptionalProperty = IsExactOptionalProperty;
	/** Checks this value using the AllowArrayObjects policy */
	function IsObjectLike(value) {
		const isObject = IsObject$2(value);
		return TypeSystemPolicy.AllowArrayObject ? isObject : isObject && !IsArray$2(value);
	}
	TypeSystemPolicy.IsObjectLike = IsObjectLike;
	/** Checks this value as a record using the AllowArrayObjects policy */
	function IsRecordLike(value) {
		return IsObjectLike(value) && !(value instanceof Date) && !(value instanceof Uint8Array);
	}
	TypeSystemPolicy.IsRecordLike = IsRecordLike;
	/** Checks this value using the AllowNaN policy */
	function IsNumberLike(value) {
		return TypeSystemPolicy.AllowNaN ? IsNumber$2(value) : Number.isFinite(value);
	}
	TypeSystemPolicy.IsNumberLike = IsNumberLike;
	/** Checks this value using the AllowVoidNull policy */
	function IsVoidLike(value) {
		const isUndefined = IsUndefined$2(value);
		return TypeSystemPolicy.AllowNullVoid ? isUndefined || value === null : isUndefined;
	}
	TypeSystemPolicy.IsVoidLike = IsVoidLike;
})(TypeSystemPolicy || (TypeSystemPolicy = {}));
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/create/immutable.mjs
function ImmutableArray(value) {
	return globalThis.Object.freeze(value).map((value) => Immutable(value));
}
function ImmutableDate(value) {
	return value;
}
function ImmutableUint8Array(value) {
	return value;
}
function ImmutableRegExp(value) {
	return value;
}
function ImmutableObject(value) {
	const result = {};
	for (const key of Object.getOwnPropertyNames(value)) result[key] = Immutable(value[key]);
	for (const key of Object.getOwnPropertySymbols(value)) result[key] = Immutable(value[key]);
	return globalThis.Object.freeze(result);
}
/** Specialized deep immutable value. Applies freeze recursively to the given value */
function Immutable(value) {
	return IsArray$3(value) ? ImmutableArray(value) : IsDate$3(value) ? ImmutableDate(value) : IsUint8Array$3(value) ? ImmutableUint8Array(value) : IsRegExp$2(value) ? ImmutableRegExp(value) : IsObject$3(value) ? ImmutableObject(value) : value;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/create/type.mjs
/** Creates TypeBox schematics using the configured InstanceMode */
function CreateType(schema, options) {
	const result = options !== void 0 ? {
		...options,
		...schema
	} : schema;
	switch (TypeSystemPolicy.InstanceMode) {
		case "freeze": return Immutable(result);
		case "clone": return Clone(result);
		default: return result;
	}
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/error/error.mjs
/** The base Error type thrown for all TypeBox exceptions  */
var TypeBoxError = class extends Error {
	constructor(message) {
		super(message);
	}
};
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/symbols/symbols.mjs
/** Symbol key applied to transform types */
const TransformKind = Symbol.for("TypeBox.Transform");
/** Symbol key applied to readonly types */
const ReadonlyKind = Symbol.for("TypeBox.Readonly");
/** Symbol key applied to optional types */
const OptionalKind = Symbol.for("TypeBox.Optional");
/** Symbol key applied to types */
const Hint = Symbol.for("TypeBox.Hint");
/** Symbol key applied to types */
const Kind = Symbol.for("TypeBox.Kind");
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/guard/kind.mjs
/** `[Kind-Only]` Returns true if this value has a Readonly symbol */
function IsReadonly(value) {
	return IsObject$3(value) && value[ReadonlyKind] === "Readonly";
}
/** `[Kind-Only]` Returns true if this value has a Optional symbol */
function IsOptional$1(value) {
	return IsObject$3(value) && value[OptionalKind] === "Optional";
}
/** `[Kind-Only]` Returns true if the given value is TAny */
function IsAny$1(value) {
	return IsKindOf$1(value, "Any");
}
/** `[Kind-Only]` Returns true if the given value is TArgument */
function IsArgument$1(value) {
	return IsKindOf$1(value, "Argument");
}
/** `[Kind-Only]` Returns true if the given value is TArray */
function IsArray$1(value) {
	return IsKindOf$1(value, "Array");
}
/** `[Kind-Only]` Returns true if the given value is TAsyncIterator */
function IsAsyncIterator$1(value) {
	return IsKindOf$1(value, "AsyncIterator");
}
/** `[Kind-Only]` Returns true if the given value is TBigInt */
function IsBigInt$1(value) {
	return IsKindOf$1(value, "BigInt");
}
/** `[Kind-Only]` Returns true if the given value is TBoolean */
function IsBoolean$1(value) {
	return IsKindOf$1(value, "Boolean");
}
/** `[Kind-Only]` Returns true if the given value is TComputed */
function IsComputed$1(value) {
	return IsKindOf$1(value, "Computed");
}
/** `[Kind-Only]` Returns true if the given value is TConstructor */
function IsConstructor$1(value) {
	return IsKindOf$1(value, "Constructor");
}
/** `[Kind-Only]` Returns true if the given value is TDate */
function IsDate$1(value) {
	return IsKindOf$1(value, "Date");
}
/** `[Kind-Only]` Returns true if the given value is TFunction */
function IsFunction$1(value) {
	return IsKindOf$1(value, "Function");
}
/** `[Kind-Only]` Returns true if the given value is TInteger */
function IsInteger$1(value) {
	return IsKindOf$1(value, "Integer");
}
/** `[Kind-Only]` Returns true if the given value is TIntersect */
function IsIntersect$1(value) {
	return IsKindOf$1(value, "Intersect");
}
/** `[Kind-Only]` Returns true if the given value is TIterator */
function IsIterator$1(value) {
	return IsKindOf$1(value, "Iterator");
}
/** `[Kind-Only]` Returns true if the given value is a TKind with the given name. */
function IsKindOf$1(value, kind) {
	return IsObject$3(value) && Kind in value && value[Kind] === kind;
}
/** `[Kind-Only]` Returns true if the given value is TLiteralValue */
function IsLiteralValue$1(value) {
	return IsBoolean$3(value) || IsNumber$3(value) || IsString$3(value);
}
/** `[Kind-Only]` Returns true if the given value is TLiteral */
function IsLiteral$1(value) {
	return IsKindOf$1(value, "Literal");
}
/** `[Kind-Only]` Returns true if the given value is a TMappedKey */
function IsMappedKey$1(value) {
	return IsKindOf$1(value, "MappedKey");
}
/** `[Kind-Only]` Returns true if the given value is TMappedResult */
function IsMappedResult$1(value) {
	return IsKindOf$1(value, "MappedResult");
}
/** `[Kind-Only]` Returns true if the given value is TNever */
function IsNever$1(value) {
	return IsKindOf$1(value, "Never");
}
/** `[Kind-Only]` Returns true if the given value is TNot */
function IsNot$1(value) {
	return IsKindOf$1(value, "Not");
}
/** `[Kind-Only]` Returns true if the given value is TNull */
function IsNull$1(value) {
	return IsKindOf$1(value, "Null");
}
/** `[Kind-Only]` Returns true if the given value is TNumber */
function IsNumber$1(value) {
	return IsKindOf$1(value, "Number");
}
/** `[Kind-Only]` Returns true if the given value is TObject */
function IsObject$1(value) {
	return IsKindOf$1(value, "Object");
}
/** `[Kind-Only]` Returns true if the given value is TPromise */
function IsPromise$1(value) {
	return IsKindOf$1(value, "Promise");
}
/** `[Kind-Only]` Returns true if the given value is TRecord */
function IsRecord$1(value) {
	return IsKindOf$1(value, "Record");
}
/** `[Kind-Only]` Returns true if the given value is TRef */
function IsRef$1(value) {
	return IsKindOf$1(value, "Ref");
}
/** `[Kind-Only]` Returns true if the given value is TRegExp */
function IsRegExp$1(value) {
	return IsKindOf$1(value, "RegExp");
}
/** `[Kind-Only]` Returns true if the given value is TString */
function IsString$1(value) {
	return IsKindOf$1(value, "String");
}
/** `[Kind-Only]` Returns true if the given value is TSymbol */
function IsSymbol$1(value) {
	return IsKindOf$1(value, "Symbol");
}
/** `[Kind-Only]` Returns true if the given value is TTemplateLiteral */
function IsTemplateLiteral$1(value) {
	return IsKindOf$1(value, "TemplateLiteral");
}
/** `[Kind-Only]` Returns true if the given value is TThis */
function IsThis$1(value) {
	return IsKindOf$1(value, "This");
}
/** `[Kind-Only]` Returns true of this value is TTransform */
function IsTransform$1(value) {
	return IsObject$3(value) && TransformKind in value;
}
/** `[Kind-Only]` Returns true if the given value is TTuple */
function IsTuple$1(value) {
	return IsKindOf$1(value, "Tuple");
}
/** `[Kind-Only]` Returns true if the given value is TUndefined */
function IsUndefined$1(value) {
	return IsKindOf$1(value, "Undefined");
}
/** `[Kind-Only]` Returns true if the given value is TUnion */
function IsUnion$1(value) {
	return IsKindOf$1(value, "Union");
}
/** `[Kind-Only]` Returns true if the given value is TUint8Array */
function IsUint8Array$1(value) {
	return IsKindOf$1(value, "Uint8Array");
}
/** `[Kind-Only]` Returns true if the given value is TUnknown */
function IsUnknown$1(value) {
	return IsKindOf$1(value, "Unknown");
}
/** `[Kind-Only]` Returns true if the given value is a raw TUnsafe */
function IsUnsafe$1(value) {
	return IsKindOf$1(value, "Unsafe");
}
/** `[Kind-Only]` Returns true if the given value is TVoid */
function IsVoid$1(value) {
	return IsKindOf$1(value, "Void");
}
/** `[Kind-Only]` Returns true if the given value is TKind */
function IsKind$1(value) {
	return IsObject$3(value) && Kind in value && IsString$3(value[Kind]);
}
/** `[Kind-Only]` Returns true if the given value is TSchema */
function IsSchema$1(value) {
	return IsAny$1(value) || IsArgument$1(value) || IsArray$1(value) || IsBoolean$1(value) || IsBigInt$1(value) || IsAsyncIterator$1(value) || IsComputed$1(value) || IsConstructor$1(value) || IsDate$1(value) || IsFunction$1(value) || IsInteger$1(value) || IsIntersect$1(value) || IsIterator$1(value) || IsLiteral$1(value) || IsMappedKey$1(value) || IsMappedResult$1(value) || IsNever$1(value) || IsNot$1(value) || IsNull$1(value) || IsNumber$1(value) || IsObject$1(value) || IsPromise$1(value) || IsRecord$1(value) || IsRef$1(value) || IsRegExp$1(value) || IsString$1(value) || IsSymbol$1(value) || IsTemplateLiteral$1(value) || IsThis$1(value) || IsTuple$1(value) || IsUndefined$1(value) || IsUnion$1(value) || IsUint8Array$1(value) || IsUnknown$1(value) || IsUnsafe$1(value) || IsVoid$1(value) || IsKind$1(value);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/guard/type.mjs
const KnownTypes = [
	"Argument",
	"Any",
	"Array",
	"AsyncIterator",
	"BigInt",
	"Boolean",
	"Computed",
	"Constructor",
	"Date",
	"Enum",
	"Function",
	"Integer",
	"Intersect",
	"Iterator",
	"Literal",
	"MappedKey",
	"MappedResult",
	"Not",
	"Null",
	"Number",
	"Object",
	"Promise",
	"Record",
	"Ref",
	"RegExp",
	"String",
	"Symbol",
	"TemplateLiteral",
	"This",
	"Tuple",
	"Undefined",
	"Union",
	"Uint8Array",
	"Unknown",
	"Void"
];
function IsPattern(value) {
	try {
		new RegExp(value);
		return true;
	} catch {
		return false;
	}
}
function IsControlCharacterFree(value) {
	if (!IsString$3(value)) return false;
	for (let i = 0; i < value.length; i++) {
		const code = value.charCodeAt(i);
		if (code >= 7 && code <= 13 || code === 27 || code === 127) return false;
	}
	return true;
}
function IsAdditionalProperties(value) {
	return IsOptionalBoolean(value) || IsSchema(value);
}
function IsOptionalBigInt(value) {
	return IsUndefined$3(value) || IsBigInt$3(value);
}
function IsOptionalNumber(value) {
	return IsUndefined$3(value) || IsNumber$3(value);
}
function IsOptionalBoolean(value) {
	return IsUndefined$3(value) || IsBoolean$3(value);
}
function IsOptionalString(value) {
	return IsUndefined$3(value) || IsString$3(value);
}
function IsOptionalPattern(value) {
	return IsUndefined$3(value) || IsString$3(value) && IsControlCharacterFree(value) && IsPattern(value);
}
function IsOptionalFormat(value) {
	return IsUndefined$3(value) || IsString$3(value) && IsControlCharacterFree(value);
}
function IsOptionalSchema(value) {
	return IsUndefined$3(value) || IsSchema(value);
}
/** Returns true if this value has a Optional symbol */
function IsOptional(value) {
	return IsObject$3(value) && value[OptionalKind] === "Optional";
}
/** Returns true if the given value is TAny */
function IsAny(value) {
	return IsKindOf(value, "Any") && IsOptionalString(value.$id);
}
/** Returns true if the given value is TArgument */
function IsArgument(value) {
	return IsKindOf(value, "Argument") && IsNumber$3(value.index);
}
/** Returns true if the given value is TArray */
function IsArray(value) {
	return IsKindOf(value, "Array") && value.type === "array" && IsOptionalString(value.$id) && IsSchema(value.items) && IsOptionalNumber(value.minItems) && IsOptionalNumber(value.maxItems) && IsOptionalBoolean(value.uniqueItems) && IsOptionalSchema(value.contains) && IsOptionalNumber(value.minContains) && IsOptionalNumber(value.maxContains);
}
/** Returns true if the given value is TAsyncIterator */
function IsAsyncIterator(value) {
	return IsKindOf(value, "AsyncIterator") && value.type === "AsyncIterator" && IsOptionalString(value.$id) && IsSchema(value.items);
}
/** Returns true if the given value is TBigInt */
function IsBigInt(value) {
	return IsKindOf(value, "BigInt") && value.type === "bigint" && IsOptionalString(value.$id) && IsOptionalBigInt(value.exclusiveMaximum) && IsOptionalBigInt(value.exclusiveMinimum) && IsOptionalBigInt(value.maximum) && IsOptionalBigInt(value.minimum) && IsOptionalBigInt(value.multipleOf);
}
/** Returns true if the given value is TBoolean */
function IsBoolean(value) {
	return IsKindOf(value, "Boolean") && value.type === "boolean" && IsOptionalString(value.$id);
}
/** Returns true if the given value is TComputed */
function IsComputed(value) {
	return IsKindOf(value, "Computed") && IsString$3(value.target) && IsArray$3(value.parameters) && value.parameters.every((schema) => IsSchema(schema));
}
/** Returns true if the given value is TConstructor */
function IsConstructor(value) {
	return IsKindOf(value, "Constructor") && value.type === "Constructor" && IsOptionalString(value.$id) && IsArray$3(value.parameters) && value.parameters.every((schema) => IsSchema(schema)) && IsSchema(value.returns);
}
/** Returns true if the given value is TDate */
function IsDate(value) {
	return IsKindOf(value, "Date") && value.type === "Date" && IsOptionalString(value.$id) && IsOptionalNumber(value.exclusiveMaximumTimestamp) && IsOptionalNumber(value.exclusiveMinimumTimestamp) && IsOptionalNumber(value.maximumTimestamp) && IsOptionalNumber(value.minimumTimestamp) && IsOptionalNumber(value.multipleOfTimestamp);
}
/** Returns true if the given value is TFunction */
function IsFunction(value) {
	return IsKindOf(value, "Function") && value.type === "Function" && IsOptionalString(value.$id) && IsArray$3(value.parameters) && value.parameters.every((schema) => IsSchema(schema)) && IsSchema(value.returns);
}
/** Returns true if the given value is TInteger */
function IsInteger(value) {
	return IsKindOf(value, "Integer") && value.type === "integer" && IsOptionalString(value.$id) && IsOptionalNumber(value.exclusiveMaximum) && IsOptionalNumber(value.exclusiveMinimum) && IsOptionalNumber(value.maximum) && IsOptionalNumber(value.minimum) && IsOptionalNumber(value.multipleOf);
}
/** Returns true if the given schema is TProperties */
function IsProperties(value) {
	return IsObject$3(value) && Object.entries(value).every(([key, schema]) => IsControlCharacterFree(key) && IsSchema(schema));
}
/** Returns true if the given value is TIntersect */
function IsIntersect(value) {
	return IsKindOf(value, "Intersect") && (IsString$3(value.type) && value.type !== "object" ? false : true) && IsArray$3(value.allOf) && value.allOf.every((schema) => IsSchema(schema) && !IsTransform(schema)) && IsOptionalString(value.type) && (IsOptionalBoolean(value.unevaluatedProperties) || IsOptionalSchema(value.unevaluatedProperties)) && IsOptionalString(value.$id);
}
/** Returns true if the given value is TIterator */
function IsIterator(value) {
	return IsKindOf(value, "Iterator") && value.type === "Iterator" && IsOptionalString(value.$id) && IsSchema(value.items);
}
/** Returns true if the given value is a TKind with the given name. */
function IsKindOf(value, kind) {
	return IsObject$3(value) && Kind in value && value[Kind] === kind;
}
/** Returns true if the given value is TLiteral<string> */
function IsLiteralString(value) {
	return IsLiteral(value) && IsString$3(value.const);
}
/** Returns true if the given value is TLiteral<number> */
function IsLiteralNumber(value) {
	return IsLiteral(value) && IsNumber$3(value.const);
}
/** Returns true if the given value is TLiteral<boolean> */
function IsLiteralBoolean(value) {
	return IsLiteral(value) && IsBoolean$3(value.const);
}
/** Returns true if the given value is TLiteral */
function IsLiteral(value) {
	return IsKindOf(value, "Literal") && IsOptionalString(value.$id) && IsLiteralValue(value.const);
}
/** Returns true if the given value is a TLiteralValue */
function IsLiteralValue(value) {
	return IsBoolean$3(value) || IsNumber$3(value) || IsString$3(value);
}
/** Returns true if the given value is a TMappedKey */
function IsMappedKey(value) {
	return IsKindOf(value, "MappedKey") && IsArray$3(value.keys) && value.keys.every((key) => IsNumber$3(key) || IsString$3(key));
}
/** Returns true if the given value is TMappedResult */
function IsMappedResult(value) {
	return IsKindOf(value, "MappedResult") && IsProperties(value.properties);
}
/** Returns true if the given value is TNever */
function IsNever(value) {
	return IsKindOf(value, "Never") && IsObject$3(value.not) && Object.getOwnPropertyNames(value.not).length === 0;
}
/** Returns true if the given value is TNot */
function IsNot(value) {
	return IsKindOf(value, "Not") && IsSchema(value.not);
}
/** Returns true if the given value is TNull */
function IsNull(value) {
	return IsKindOf(value, "Null") && value.type === "null" && IsOptionalString(value.$id);
}
/** Returns true if the given value is TNumber */
function IsNumber(value) {
	return IsKindOf(value, "Number") && value.type === "number" && IsOptionalString(value.$id) && IsOptionalNumber(value.exclusiveMaximum) && IsOptionalNumber(value.exclusiveMinimum) && IsOptionalNumber(value.maximum) && IsOptionalNumber(value.minimum) && IsOptionalNumber(value.multipleOf);
}
/** Returns true if the given value is TObject */
function IsObject(value) {
	return IsKindOf(value, "Object") && value.type === "object" && IsOptionalString(value.$id) && IsProperties(value.properties) && IsAdditionalProperties(value.additionalProperties) && IsOptionalNumber(value.minProperties) && IsOptionalNumber(value.maxProperties);
}
/** Returns true if the given value is TPromise */
function IsPromise(value) {
	return IsKindOf(value, "Promise") && value.type === "Promise" && IsOptionalString(value.$id) && IsSchema(value.item);
}
/** Returns true if the given value is TRecord */
function IsRecord(value) {
	return IsKindOf(value, "Record") && value.type === "object" && IsOptionalString(value.$id) && IsAdditionalProperties(value.additionalProperties) && IsObject$3(value.patternProperties) && ((schema) => {
		const keys = Object.getOwnPropertyNames(schema.patternProperties);
		return keys.length === 1 && IsPattern(keys[0]) && IsObject$3(schema.patternProperties) && IsSchema(schema.patternProperties[keys[0]]);
	})(value);
}
/** Returns true if the given value is TRef */
function IsRef(value) {
	return IsKindOf(value, "Ref") && IsOptionalString(value.$id) && IsString$3(value.$ref);
}
/** Returns true if the given value is TRegExp */
function IsRegExp(value) {
	return IsKindOf(value, "RegExp") && IsOptionalString(value.$id) && IsString$3(value.source) && IsString$3(value.flags) && IsOptionalNumber(value.maxLength) && IsOptionalNumber(value.minLength);
}
/** Returns true if the given value is TString */
function IsString(value) {
	return IsKindOf(value, "String") && value.type === "string" && IsOptionalString(value.$id) && IsOptionalNumber(value.minLength) && IsOptionalNumber(value.maxLength) && IsOptionalPattern(value.pattern) && IsOptionalFormat(value.format);
}
/** Returns true if the given value is TSymbol */
function IsSymbol(value) {
	return IsKindOf(value, "Symbol") && value.type === "symbol" && IsOptionalString(value.$id);
}
/** Returns true if the given value is TTemplateLiteral */
function IsTemplateLiteral(value) {
	return IsKindOf(value, "TemplateLiteral") && value.type === "string" && IsString$3(value.pattern) && value.pattern[0] === "^" && value.pattern[value.pattern.length - 1] === "$";
}
/** Returns true if the given value is TThis */
function IsThis(value) {
	return IsKindOf(value, "This") && IsOptionalString(value.$id) && IsString$3(value.$ref);
}
/** Returns true of this value is TTransform */
function IsTransform(value) {
	return IsObject$3(value) && TransformKind in value;
}
/** Returns true if the given value is TTuple */
function IsTuple(value) {
	return IsKindOf(value, "Tuple") && value.type === "array" && IsOptionalString(value.$id) && IsNumber$3(value.minItems) && IsNumber$3(value.maxItems) && value.minItems === value.maxItems && (IsUndefined$3(value.items) && IsUndefined$3(value.additionalItems) && value.minItems === 0 || IsArray$3(value.items) && value.items.every((schema) => IsSchema(schema)));
}
/** Returns true if the given value is TUndefined */
function IsUndefined(value) {
	return IsKindOf(value, "Undefined") && value.type === "undefined" && IsOptionalString(value.$id);
}
/** Returns true if the given value is TUnion */
function IsUnion(value) {
	return IsKindOf(value, "Union") && IsOptionalString(value.$id) && IsObject$3(value) && IsArray$3(value.anyOf) && value.anyOf.every((schema) => IsSchema(schema));
}
/** Returns true if the given value is TUint8Array */
function IsUint8Array(value) {
	return IsKindOf(value, "Uint8Array") && value.type === "Uint8Array" && IsOptionalString(value.$id) && IsOptionalNumber(value.minByteLength) && IsOptionalNumber(value.maxByteLength);
}
/** Returns true if the given value is TUnknown */
function IsUnknown(value) {
	return IsKindOf(value, "Unknown") && IsOptionalString(value.$id);
}
/** Returns true if the given value is a raw TUnsafe */
function IsUnsafe(value) {
	return IsKindOf(value, "Unsafe");
}
/** Returns true if the given value is TVoid */
function IsVoid(value) {
	return IsKindOf(value, "Void") && value.type === "void" && IsOptionalString(value.$id);
}
/** Returns true if the given value is TKind */
function IsKind(value) {
	return IsObject$3(value) && Kind in value && IsString$3(value[Kind]) && !KnownTypes.includes(value[Kind]);
}
/** Returns true if the given value is TSchema */
function IsSchema(value) {
	return IsObject$3(value) && (IsAny(value) || IsArgument(value) || IsArray(value) || IsBoolean(value) || IsBigInt(value) || IsAsyncIterator(value) || IsComputed(value) || IsConstructor(value) || IsDate(value) || IsFunction(value) || IsInteger(value) || IsIntersect(value) || IsIterator(value) || IsLiteral(value) || IsMappedKey(value) || IsMappedResult(value) || IsNever(value) || IsNot(value) || IsNull(value) || IsNumber(value) || IsObject(value) || IsPromise(value) || IsRecord(value) || IsRef(value) || IsRegExp(value) || IsString(value) || IsSymbol(value) || IsTemplateLiteral(value) || IsThis(value) || IsTuple(value) || IsUndefined(value) || IsUnion(value) || IsUint8Array(value) || IsUnknown(value) || IsUnsafe(value) || IsVoid(value) || IsKind(value));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/patterns/patterns.mjs
const PatternBoolean = "(true|false)";
const PatternNumber = "(0|[1-9][0-9]*)";
const PatternString = "(.*)";
const PatternNever = "(?!.*)";
const PatternNumberExact = `^${PatternNumber}$`;
const PatternStringExact = `^${PatternString}$`;
const PatternNeverExact = `^${PatternNever}$`;
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/registry/format.mjs
/** A registry for user defined string formats */
const map$1 = /* @__PURE__ */ new Map();
/** Returns true if the user defined string format exists */
function Has$1(format) {
	return map$1.has(format);
}
/** Gets a validation function for a user defined string format */
function Get$1(format) {
	return map$1.get(format);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/registry/type.mjs
/** A registry for user defined types */
const map = /* @__PURE__ */ new Map();
/** Returns true if this registry contains this kind */
function Has(kind) {
	return map.has(kind);
}
/** Gets a custom validation function for a user defined type */
function Get(kind) {
	return map.get(kind);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/sets/set.mjs
/** Returns true if element right is in the set of left */
function SetIncludes(T, S) {
	return T.includes(S);
}
/** Returns a distinct set of elements */
function SetDistinct(T) {
	return [...new Set(T)];
}
/** Returns the Intersect of the given sets */
function SetIntersect(T, S) {
	return T.filter((L) => S.includes(L));
}
function SetIntersectManyResolve(T, Init) {
	return T.reduce((Acc, L) => {
		return SetIntersect(Acc, L);
	}, Init);
}
function SetIntersectMany(T) {
	return T.length === 1 ? T[0] : T.length > 1 ? SetIntersectManyResolve(T.slice(1), T[0]) : [];
}
/** Returns the Union of multiple sets */
function SetUnionMany(T) {
	const Acc = [];
	for (const L of T) Acc.push(...L);
	return Acc;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/any/any.mjs
/** `[Json]` Creates an Any type */
function Any(options) {
	return CreateType({ [Kind]: "Any" }, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/array/array.mjs
/** `[Json]` Creates an Array type */
function Array$1(items, options) {
	return CreateType({
		[Kind]: "Array",
		type: "array",
		items
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/argument/argument.mjs
/** `[JavaScript]` Creates an Argument Type. */
function Argument(index) {
	return CreateType({
		[Kind]: "Argument",
		index
	});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/async-iterator/async-iterator.mjs
/** `[JavaScript]` Creates a AsyncIterator type */
function AsyncIterator(items, options) {
	return CreateType({
		[Kind]: "AsyncIterator",
		type: "AsyncIterator",
		items
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/computed/computed.mjs
/** `[Internal]` Creates a deferred computed type. This type is used exclusively in modules to defer resolution of computable types that contain interior references  */
function Computed(target, parameters, options) {
	return CreateType({
		[Kind]: "Computed",
		target,
		parameters
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/discard/discard.mjs
function DiscardKey(value, key) {
	const { [key]: _, ...rest } = value;
	return rest;
}
/** Discards property keys from the given value. This function returns a shallow Clone. */
function Discard(value, keys) {
	return keys.reduce((acc, key) => DiscardKey(acc, key), value);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/never/never.mjs
/** `[Json]` Creates a Never type */
function Never(options) {
	return CreateType({
		[Kind]: "Never",
		not: {}
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/mapped/mapped-result.mjs
function MappedResult(properties) {
	return CreateType({
		[Kind]: "MappedResult",
		properties
	});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/constructor/constructor.mjs
/** `[JavaScript]` Creates a Constructor type */
function Constructor(parameters, returns, options) {
	return CreateType({
		[Kind]: "Constructor",
		type: "Constructor",
		parameters,
		returns
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/function/function.mjs
/** `[JavaScript]` Creates a Function type */
function Function$1(parameters, returns, options) {
	return CreateType({
		[Kind]: "Function",
		type: "Function",
		parameters,
		returns
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/union/union-create.mjs
function UnionCreate(T, options) {
	return CreateType({
		[Kind]: "Union",
		anyOf: T
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/union/union-evaluated.mjs
function IsUnionOptional(types) {
	return types.some((type) => IsOptional$1(type));
}
function RemoveOptionalFromRest$1(types) {
	return types.map((left) => IsOptional$1(left) ? RemoveOptionalFromType$1(left) : left);
}
function RemoveOptionalFromType$1(T) {
	return Discard(T, [OptionalKind]);
}
function ResolveUnion(types, options) {
	return IsUnionOptional(types) ? Optional(UnionCreate(RemoveOptionalFromRest$1(types), options)) : UnionCreate(RemoveOptionalFromRest$1(types), options);
}
/** `[Json]` Creates an evaluated Union type */
function UnionEvaluated(T, options) {
	return T.length === 1 ? CreateType(T[0], options) : T.length === 0 ? Never(options) : ResolveUnion(T, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/union/union.mjs
/** `[Json]` Creates a Union type */
function Union$1(types, options) {
	return types.length === 0 ? Never(options) : types.length === 1 ? CreateType(types[0], options) : UnionCreate(types, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/template-literal/parse.mjs
var TemplateLiteralParserError = class extends TypeBoxError {};
function Unescape(pattern) {
	return pattern.replace(/\\\$/g, "$").replace(/\\\*/g, "*").replace(/\\\^/g, "^").replace(/\\\|/g, "|").replace(/\\\(/g, "(").replace(/\\\)/g, ")");
}
function IsNonEscaped(pattern, index, char) {
	return pattern[index] === char && pattern.charCodeAt(index - 1) !== 92;
}
function IsOpenParen(pattern, index) {
	return IsNonEscaped(pattern, index, "(");
}
function IsCloseParen(pattern, index) {
	return IsNonEscaped(pattern, index, ")");
}
function IsSeparator(pattern, index) {
	return IsNonEscaped(pattern, index, "|");
}
function IsGroup(pattern) {
	if (!(IsOpenParen(pattern, 0) && IsCloseParen(pattern, pattern.length - 1))) return false;
	let count = 0;
	for (let index = 0; index < pattern.length; index++) {
		if (IsOpenParen(pattern, index)) count += 1;
		if (IsCloseParen(pattern, index)) count -= 1;
		if (count === 0 && index !== pattern.length - 1) return false;
	}
	return true;
}
function InGroup(pattern) {
	return pattern.slice(1, pattern.length - 1);
}
function IsPrecedenceOr(pattern) {
	let count = 0;
	for (let index = 0; index < pattern.length; index++) {
		if (IsOpenParen(pattern, index)) count += 1;
		if (IsCloseParen(pattern, index)) count -= 1;
		if (IsSeparator(pattern, index) && count === 0) return true;
	}
	return false;
}
function IsPrecedenceAnd(pattern) {
	for (let index = 0; index < pattern.length; index++) if (IsOpenParen(pattern, index)) return true;
	return false;
}
function Or(pattern) {
	let [count, start] = [0, 0];
	const expressions = [];
	for (let index = 0; index < pattern.length; index++) {
		if (IsOpenParen(pattern, index)) count += 1;
		if (IsCloseParen(pattern, index)) count -= 1;
		if (IsSeparator(pattern, index) && count === 0) {
			const range = pattern.slice(start, index);
			if (range.length > 0) expressions.push(TemplateLiteralParse(range));
			start = index + 1;
		}
	}
	const range = pattern.slice(start);
	if (range.length > 0) expressions.push(TemplateLiteralParse(range));
	if (expressions.length === 0) return {
		type: "const",
		const: ""
	};
	if (expressions.length === 1) return expressions[0];
	return {
		type: "or",
		expr: expressions
	};
}
function And(pattern) {
	function Group(value, index) {
		if (!IsOpenParen(value, index)) throw new TemplateLiteralParserError(`TemplateLiteralParser: Index must point to open parens`);
		let count = 0;
		for (let scan = index; scan < value.length; scan++) {
			if (IsOpenParen(value, scan)) count += 1;
			if (IsCloseParen(value, scan)) count -= 1;
			if (count === 0) return [index, scan];
		}
		throw new TemplateLiteralParserError(`TemplateLiteralParser: Unclosed group parens in expression`);
	}
	function Range(pattern, index) {
		for (let scan = index; scan < pattern.length; scan++) if (IsOpenParen(pattern, scan)) return [index, scan];
		return [index, pattern.length];
	}
	const expressions = [];
	for (let index = 0; index < pattern.length; index++) if (IsOpenParen(pattern, index)) {
		const [start, end] = Group(pattern, index);
		const range = pattern.slice(start, end + 1);
		expressions.push(TemplateLiteralParse(range));
		index = end;
	} else {
		const [start, end] = Range(pattern, index);
		const range = pattern.slice(start, end);
		if (range.length > 0) expressions.push(TemplateLiteralParse(range));
		index = end - 1;
	}
	return expressions.length === 0 ? {
		type: "const",
		const: ""
	} : expressions.length === 1 ? expressions[0] : {
		type: "and",
		expr: expressions
	};
}
/** Parses a pattern and returns an expression tree */
function TemplateLiteralParse(pattern) {
	return IsGroup(pattern) ? TemplateLiteralParse(InGroup(pattern)) : IsPrecedenceOr(pattern) ? Or(pattern) : IsPrecedenceAnd(pattern) ? And(pattern) : {
		type: "const",
		const: Unescape(pattern)
	};
}
/** Parses a pattern and strips forward and trailing ^ and $ */
function TemplateLiteralParseExact(pattern) {
	return TemplateLiteralParse(pattern.slice(1, pattern.length - 1));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/template-literal/finite.mjs
var TemplateLiteralFiniteError = class extends TypeBoxError {};
function IsNumberExpression(expression) {
	return expression.type === "or" && expression.expr.length === 2 && expression.expr[0].type === "const" && expression.expr[0].const === "0" && expression.expr[1].type === "const" && expression.expr[1].const === "[1-9][0-9]*";
}
function IsBooleanExpression(expression) {
	return expression.type === "or" && expression.expr.length === 2 && expression.expr[0].type === "const" && expression.expr[0].const === "true" && expression.expr[1].type === "const" && expression.expr[1].const === "false";
}
function IsStringExpression(expression) {
	return expression.type === "const" && expression.const === ".*";
}
function IsTemplateLiteralExpressionFinite(expression) {
	return IsNumberExpression(expression) || IsStringExpression(expression) ? false : IsBooleanExpression(expression) ? true : expression.type === "and" ? expression.expr.every((expr) => IsTemplateLiteralExpressionFinite(expr)) : expression.type === "or" ? expression.expr.every((expr) => IsTemplateLiteralExpressionFinite(expr)) : expression.type === "const" ? true : (() => {
		throw new TemplateLiteralFiniteError(`Unknown expression type`);
	})();
}
/** Returns true if this TemplateLiteral resolves to a finite set of values */
function IsTemplateLiteralFinite(schema) {
	return IsTemplateLiteralExpressionFinite(TemplateLiteralParseExact(schema.pattern));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/template-literal/generate.mjs
var TemplateLiteralGenerateError = class extends TypeBoxError {};
function* GenerateReduce(buffer) {
	if (buffer.length === 1) return yield* buffer[0];
	for (const left of buffer[0]) for (const right of GenerateReduce(buffer.slice(1))) yield `${left}${right}`;
}
function* GenerateAnd(expression) {
	return yield* GenerateReduce(expression.expr.map((expr) => [...TemplateLiteralExpressionGenerate(expr)]));
}
function* GenerateOr(expression) {
	for (const expr of expression.expr) yield* TemplateLiteralExpressionGenerate(expr);
}
function* GenerateConst(expression) {
	return yield expression.const;
}
function* TemplateLiteralExpressionGenerate(expression) {
	return expression.type === "and" ? yield* GenerateAnd(expression) : expression.type === "or" ? yield* GenerateOr(expression) : expression.type === "const" ? yield* GenerateConst(expression) : (() => {
		throw new TemplateLiteralGenerateError("Unknown expression");
	})();
}
/** Generates a tuple of strings from the given TemplateLiteral. Returns an empty tuple if infinite. */
function TemplateLiteralGenerate(schema) {
	const expression = TemplateLiteralParseExact(schema.pattern);
	return IsTemplateLiteralExpressionFinite(expression) ? [...TemplateLiteralExpressionGenerate(expression)] : [];
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/literal/literal.mjs
/** `[Json]` Creates a Literal type */
function Literal(value, options) {
	return CreateType({
		[Kind]: "Literal",
		const: value,
		type: typeof value
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/boolean/boolean.mjs
/** `[Json]` Creates a Boolean type */
function Boolean$1(options) {
	return CreateType({
		[Kind]: "Boolean",
		type: "boolean"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/bigint/bigint.mjs
/** `[JavaScript]` Creates a BigInt type */
function BigInt$1(options) {
	return CreateType({
		[Kind]: "BigInt",
		type: "bigint"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/number/number.mjs
/** `[Json]` Creates a Number type */
function Number$1(options) {
	return CreateType({
		[Kind]: "Number",
		type: "number"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/string/string.mjs
/** `[Json]` Creates a String type */
function String$1(options) {
	return CreateType({
		[Kind]: "String",
		type: "string"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/template-literal/syntax.mjs
function* FromUnion$11(syntax) {
	const trim = syntax.trim().replace(/"|'/g, "");
	return trim === "boolean" ? yield Boolean$1() : trim === "number" ? yield Number$1() : trim === "bigint" ? yield BigInt$1() : trim === "string" ? yield String$1() : yield (() => {
		const literals = trim.split("|").map((literal) => Literal(literal.trim()));
		return literals.length === 0 ? Never() : literals.length === 1 ? literals[0] : UnionEvaluated(literals);
	})();
}
function* FromTerminal(syntax) {
	if (syntax[1] !== "{") return yield* [Literal("$"), ...FromSyntax(syntax.slice(1))];
	for (let i = 2; i < syntax.length; i++) if (syntax[i] === "}") {
		const L = FromUnion$11(syntax.slice(2, i));
		const R = FromSyntax(syntax.slice(i + 1));
		return yield* [...L, ...R];
	}
	yield Literal(syntax);
}
function* FromSyntax(syntax) {
	for (let i = 0; i < syntax.length; i++) if (syntax[i] === "$") return yield* [Literal(syntax.slice(0, i)), ...FromTerminal(syntax.slice(i))];
	yield Literal(syntax);
}
/** Parses TemplateLiteralSyntax and returns a tuple of TemplateLiteralKinds */
function TemplateLiteralSyntax(syntax) {
	return [...FromSyntax(syntax)];
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/template-literal/pattern.mjs
var TemplateLiteralPatternError = class extends TypeBoxError {};
function Escape(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Visit$4(schema, acc) {
	return IsTemplateLiteral$1(schema) ? schema.pattern.slice(1, schema.pattern.length - 1) : IsUnion$1(schema) ? `(${schema.anyOf.map((schema) => Visit$4(schema, acc)).join("|")})` : IsNumber$1(schema) ? `${acc}${PatternNumber}` : IsInteger$1(schema) ? `${acc}${PatternNumber}` : IsBigInt$1(schema) ? `${acc}${PatternNumber}` : IsString$1(schema) ? `${acc}${PatternString}` : IsLiteral$1(schema) ? `${acc}${Escape(schema.const.toString())}` : IsBoolean$1(schema) ? `${acc}${PatternBoolean}` : (() => {
		throw new TemplateLiteralPatternError(`Unexpected Kind '${schema[Kind]}'`);
	})();
}
function TemplateLiteralPattern(kinds) {
	return `^${kinds.map((schema) => Visit$4(schema, "")).join("")}\$`;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/template-literal/union.mjs
/** Returns a Union from the given TemplateLiteral */
function TemplateLiteralToUnion(schema) {
	return UnionEvaluated(TemplateLiteralGenerate(schema).map((S) => Literal(S)));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/template-literal/template-literal.mjs
/** `[Json]` Creates a TemplateLiteral type */
function TemplateLiteral(unresolved, options) {
	const pattern = IsString$3(unresolved) ? TemplateLiteralPattern(TemplateLiteralSyntax(unresolved)) : TemplateLiteralPattern(unresolved);
	return CreateType({
		[Kind]: "TemplateLiteral",
		type: "string",
		pattern
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-property-keys.mjs
function FromTemplateLiteral$4(templateLiteral) {
	return TemplateLiteralGenerate(templateLiteral).map((key) => key.toString());
}
function FromUnion$10(types) {
	const result = [];
	for (const type of types) result.push(...IndexPropertyKeys(type));
	return result;
}
function FromLiteral$3(literalValue) {
	return [literalValue.toString()];
}
/** Returns a tuple of PropertyKeys derived from the given TSchema */
function IndexPropertyKeys(type) {
	return [...new Set(IsTemplateLiteral$1(type) ? FromTemplateLiteral$4(type) : IsUnion$1(type) ? FromUnion$10(type.anyOf) : IsLiteral$1(type) ? FromLiteral$3(type.const) : IsNumber$1(type) ? ["[number]"] : IsInteger$1(type) ? ["[number]"] : [])];
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-from-mapped-result.mjs
function FromProperties$18(type, properties, options) {
	const result = {};
	for (const K2 of Object.getOwnPropertyNames(properties)) result[K2] = Index(type, IndexPropertyKeys(properties[K2]), options);
	return result;
}
function FromMappedResult$11(type, mappedResult, options) {
	return FromProperties$18(type, mappedResult.properties, options);
}
function IndexFromMappedResult(type, mappedResult, options) {
	return MappedResult(FromMappedResult$11(type, mappedResult, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/indexed/indexed.mjs
function FromRest$6(types, key) {
	return types.map((type) => IndexFromPropertyKey(type, key));
}
function FromIntersectRest(types) {
	return types.filter((type) => !IsNever$1(type));
}
function FromIntersect$9(types, key) {
	return IntersectEvaluated(FromIntersectRest(FromRest$6(types, key)));
}
function FromUnionRest(types) {
	return types.some((L) => IsNever$1(L)) ? [] : types;
}
function FromUnion$9(types, key) {
	return UnionEvaluated(FromUnionRest(FromRest$6(types, key)));
}
function FromTuple$6(types, key) {
	return key in types ? types[key] : key === "[number]" ? UnionEvaluated(types) : Never();
}
function FromArray$7(type, key) {
	return key === "[number]" ? type : Never();
}
function FromProperty$2(properties, propertyKey) {
	return propertyKey in properties ? properties[propertyKey] : Never();
}
function IndexFromPropertyKey(type, propertyKey) {
	return IsIntersect$1(type) ? FromIntersect$9(type.allOf, propertyKey) : IsUnion$1(type) ? FromUnion$9(type.anyOf, propertyKey) : IsTuple$1(type) ? FromTuple$6(type.items ?? [], propertyKey) : IsArray$1(type) ? FromArray$7(type.items, propertyKey) : IsObject$1(type) ? FromProperty$2(type.properties, propertyKey) : Never();
}
function IndexFromPropertyKeys(type, propertyKeys) {
	return propertyKeys.map((propertyKey) => IndexFromPropertyKey(type, propertyKey));
}
function FromSchema(type, propertyKeys) {
	return UnionEvaluated(IndexFromPropertyKeys(type, propertyKeys));
}
/** `[Json]` Returns an Indexed property type for the given keys */
function Index(type, key, options) {
	if (IsRef$1(type) || IsRef$1(key)) {
		const error = `Index types using Ref parameters require both Type and Key to be of TSchema`;
		if (!IsSchema$1(type) || !IsSchema$1(key)) throw new TypeBoxError(error);
		return Computed("Index", [type, key]);
	}
	if (IsMappedResult$1(key)) return IndexFromMappedResult(type, key, options);
	if (IsMappedKey$1(key)) return IndexFromMappedKey(type, key, options);
	return CreateType(IsSchema$1(key) ? FromSchema(type, IndexPropertyKeys(key)) : FromSchema(type, key), options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-from-mapped-key.mjs
function MappedIndexPropertyKey(type, key, options) {
	return { [key]: Index(type, [key], Clone(options)) };
}
function MappedIndexPropertyKeys(type, propertyKeys, options) {
	return propertyKeys.reduce((result, left) => {
		return {
			...result,
			...MappedIndexPropertyKey(type, left, options)
		};
	}, {});
}
function MappedIndexProperties(type, mappedKey, options) {
	return MappedIndexPropertyKeys(type, mappedKey.keys, options);
}
function IndexFromMappedKey(type, mappedKey, options) {
	return MappedResult(MappedIndexProperties(type, mappedKey, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/iterator/iterator.mjs
/** `[JavaScript]` Creates an Iterator type */
function Iterator(items, options) {
	return CreateType({
		[Kind]: "Iterator",
		type: "Iterator",
		items
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/object/object.mjs
/** Creates a RequiredArray derived from the given TProperties value. */
function RequiredArray(properties) {
	return globalThis.Object.keys(properties).filter((key) => !IsOptional$1(properties[key]));
}
/** `[Json]` Creates an Object type */
function _Object_(properties, options) {
	const required = RequiredArray(properties);
	return CreateType(required.length > 0 ? {
		[Kind]: "Object",
		type: "object",
		required,
		properties
	} : {
		[Kind]: "Object",
		type: "object",
		properties
	}, options);
}
/** `[Json]` Creates an Object type */
var Object$1 = _Object_;
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/promise/promise.mjs
/** `[JavaScript]` Creates a Promise type */
function Promise$1(item, options) {
	return CreateType({
		[Kind]: "Promise",
		type: "Promise",
		item
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/readonly/readonly.mjs
function RemoveReadonly(schema) {
	return CreateType(Discard(schema, [ReadonlyKind]));
}
function AddReadonly(schema) {
	return CreateType({
		...schema,
		[ReadonlyKind]: "Readonly"
	});
}
function ReadonlyWithFlag(schema, F) {
	return F === false ? RemoveReadonly(schema) : AddReadonly(schema);
}
/** `[Json]` Creates a Readonly property */
function Readonly(schema, enable) {
	const F = enable ?? true;
	return IsMappedResult$1(schema) ? ReadonlyFromMappedResult(schema, F) : ReadonlyWithFlag(schema, F);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/readonly/readonly-from-mapped-result.mjs
function FromProperties$17(K, F) {
	const Acc = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(K)) Acc[K2] = Readonly(K[K2], F);
	return Acc;
}
function FromMappedResult$10(R, F) {
	return FromProperties$17(R.properties, F);
}
function ReadonlyFromMappedResult(R, F) {
	return MappedResult(FromMappedResult$10(R, F));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/tuple/tuple.mjs
/** `[Json]` Creates a Tuple type */
function Tuple(types, options) {
	return CreateType(types.length > 0 ? {
		[Kind]: "Tuple",
		type: "array",
		items: types,
		additionalItems: false,
		minItems: types.length,
		maxItems: types.length
	} : {
		[Kind]: "Tuple",
		type: "array",
		minItems: types.length,
		maxItems: types.length
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/mapped/mapped.mjs
function FromMappedResult$9(K, P) {
	return K in P ? FromSchemaType(K, P[K]) : MappedResult(P);
}
function MappedKeyToKnownMappedResultProperties(K) {
	return { [K]: Literal(K) };
}
function MappedKeyToUnknownMappedResultProperties(P) {
	const Acc = {};
	for (const L of P) Acc[L] = Literal(L);
	return Acc;
}
function MappedKeyToMappedResultProperties(K, P) {
	return SetIncludes(P, K) ? MappedKeyToKnownMappedResultProperties(K) : MappedKeyToUnknownMappedResultProperties(P);
}
function FromMappedKey$3(K, P) {
	return FromMappedResult$9(K, MappedKeyToMappedResultProperties(K, P));
}
function FromRest$5(K, T) {
	return T.map((L) => FromSchemaType(K, L));
}
function FromProperties$16(K, T) {
	const Acc = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(T)) Acc[K2] = FromSchemaType(K, T[K2]);
	return Acc;
}
function FromSchemaType(K, T) {
	const options = { ...T };
	return IsOptional$1(T) ? Optional(FromSchemaType(K, Discard(T, [OptionalKind]))) : IsReadonly(T) ? Readonly(FromSchemaType(K, Discard(T, [ReadonlyKind]))) : IsMappedResult$1(T) ? FromMappedResult$9(K, T.properties) : IsMappedKey$1(T) ? FromMappedKey$3(K, T.keys) : IsConstructor$1(T) ? Constructor(FromRest$5(K, T.parameters), FromSchemaType(K, T.returns), options) : IsFunction$1(T) ? Function$1(FromRest$5(K, T.parameters), FromSchemaType(K, T.returns), options) : IsAsyncIterator$1(T) ? AsyncIterator(FromSchemaType(K, T.items), options) : IsIterator$1(T) ? Iterator(FromSchemaType(K, T.items), options) : IsIntersect$1(T) ? Intersect$1(FromRest$5(K, T.allOf), options) : IsUnion$1(T) ? Union$1(FromRest$5(K, T.anyOf), options) : IsTuple$1(T) ? Tuple(FromRest$5(K, T.items ?? []), options) : IsObject$1(T) ? Object$1(FromProperties$16(K, T.properties), options) : IsArray$1(T) ? Array$1(FromSchemaType(K, T.items), options) : IsPromise$1(T) ? Promise$1(FromSchemaType(K, T.item), options) : T;
}
function MappedFunctionReturnType(K, T) {
	const Acc = {};
	for (const L of K) Acc[L] = FromSchemaType(L, T);
	return Acc;
}
/** `[Json]` Creates a Mapped object type */
function Mapped(key, map, options) {
	const K = IsSchema$1(key) ? IndexPropertyKeys(key) : key;
	return Object$1(MappedFunctionReturnType(K, map({
		[Kind]: "MappedKey",
		keys: K
	})), options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/optional/optional.mjs
function RemoveOptional(schema) {
	return CreateType(Discard(schema, [OptionalKind]));
}
function AddOptional(schema) {
	return CreateType({
		...schema,
		[OptionalKind]: "Optional"
	});
}
function OptionalWithFlag(schema, F) {
	return F === false ? RemoveOptional(schema) : AddOptional(schema);
}
/** `[Json]` Creates a Optional property */
function Optional(schema, enable) {
	const F = enable ?? true;
	return IsMappedResult$1(schema) ? OptionalFromMappedResult(schema, F) : OptionalWithFlag(schema, F);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/optional/optional-from-mapped-result.mjs
function FromProperties$15(P, F) {
	const Acc = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Optional(P[K2], F);
	return Acc;
}
function FromMappedResult$8(R, F) {
	return FromProperties$15(R.properties, F);
}
function OptionalFromMappedResult(R, F) {
	return MappedResult(FromMappedResult$8(R, F));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intersect/intersect-create.mjs
function IntersectCreate(T, options = {}) {
	const allObjects = T.every((schema) => IsObject$1(schema));
	const clonedUnevaluatedProperties = IsSchema$1(options.unevaluatedProperties) ? { unevaluatedProperties: options.unevaluatedProperties } : {};
	return CreateType(options.unevaluatedProperties === false || IsSchema$1(options.unevaluatedProperties) || allObjects ? {
		...clonedUnevaluatedProperties,
		[Kind]: "Intersect",
		type: "object",
		allOf: T
	} : {
		...clonedUnevaluatedProperties,
		[Kind]: "Intersect",
		allOf: T
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intersect/intersect-evaluated.mjs
function IsIntersectOptional(types) {
	return types.every((left) => IsOptional$1(left));
}
function RemoveOptionalFromType(type) {
	return Discard(type, [OptionalKind]);
}
function RemoveOptionalFromRest(types) {
	return types.map((left) => IsOptional$1(left) ? RemoveOptionalFromType(left) : left);
}
function ResolveIntersect(types, options) {
	return IsIntersectOptional(types) ? Optional(IntersectCreate(RemoveOptionalFromRest(types), options)) : IntersectCreate(RemoveOptionalFromRest(types), options);
}
/** `[Json]` Creates an evaluated Intersect type */
function IntersectEvaluated(types, options = {}) {
	if (types.length === 1) return CreateType(types[0], options);
	if (types.length === 0) return Never(options);
	if (types.some((schema) => IsTransform$1(schema))) throw new Error("Cannot intersect transform types");
	return ResolveIntersect(types, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intersect/intersect.mjs
/** `[Json]` Creates an evaluated Intersect type */
function Intersect$1(types, options) {
	if (types.length === 1) return CreateType(types[0], options);
	if (types.length === 0) return Never(options);
	if (types.some((schema) => IsTransform$1(schema))) throw new Error("Cannot intersect transform types");
	return IntersectCreate(types, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/ref/ref.mjs
/** `[Json]` Creates a Ref type. The referenced type must contain a $id */
function Ref$1(...args) {
	const [$ref, options] = typeof args[0] === "string" ? [args[0], args[1]] : [args[0].$id, args[1]];
	if (typeof $ref !== "string") throw new TypeBoxError("Ref: $ref must be a string");
	return CreateType({
		[Kind]: "Ref",
		$ref
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/awaited/awaited.mjs
function FromComputed$4(target, parameters) {
	return Computed("Awaited", [Computed(target, parameters)]);
}
function FromRef$5($ref) {
	return Computed("Awaited", [Ref$1($ref)]);
}
function FromIntersect$8(types) {
	return Intersect$1(FromRest$4(types));
}
function FromUnion$8(types) {
	return Union$1(FromRest$4(types));
}
function FromPromise$4(type) {
	return Awaited(type);
}
function FromRest$4(types) {
	return types.map((type) => Awaited(type));
}
/** `[JavaScript]` Constructs a type by recursively unwrapping Promise types */
function Awaited(type, options) {
	return CreateType(IsComputed$1(type) ? FromComputed$4(type.target, type.parameters) : IsIntersect$1(type) ? FromIntersect$8(type.allOf) : IsUnion$1(type) ? FromUnion$8(type.anyOf) : IsPromise$1(type) ? FromPromise$4(type.item) : IsRef$1(type) ? FromRef$5(type.$ref) : type, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/keyof/keyof-property-keys.mjs
function FromRest$3(types) {
	const result = [];
	for (const L of types) result.push(KeyOfPropertyKeys(L));
	return result;
}
function FromIntersect$7(types) {
	return SetUnionMany(FromRest$3(types));
}
function FromUnion$7(types) {
	return SetIntersectMany(FromRest$3(types));
}
function FromTuple$5(types) {
	return types.map((_, indexer) => indexer.toString());
}
function FromArray$6(_) {
	return ["[number]"];
}
function FromProperties$14(T) {
	return globalThis.Object.getOwnPropertyNames(T);
}
function FromPatternProperties(patternProperties) {
	if (!includePatternProperties) return [];
	return globalThis.Object.getOwnPropertyNames(patternProperties).map((key) => {
		return key[0] === "^" && key[key.length - 1] === "$" ? key.slice(1, key.length - 1) : key;
	});
}
/** Returns a tuple of PropertyKeys derived from the given TSchema. */
function KeyOfPropertyKeys(type) {
	return IsIntersect$1(type) ? FromIntersect$7(type.allOf) : IsUnion$1(type) ? FromUnion$7(type.anyOf) : IsTuple$1(type) ? FromTuple$5(type.items ?? []) : IsArray$1(type) ? FromArray$6(type.items) : IsObject$1(type) ? FromProperties$14(type.properties) : IsRecord$1(type) ? FromPatternProperties(type.patternProperties) : [];
}
let includePatternProperties = false;
/** Returns a regular expression pattern derived from the given TSchema */
function KeyOfPattern(schema) {
	includePatternProperties = true;
	const keys = KeyOfPropertyKeys(schema);
	includePatternProperties = false;
	return `^(${keys.map((key) => `(${key})`).join("|")})$`;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/keyof/keyof.mjs
function FromComputed$3(target, parameters) {
	return Computed("KeyOf", [Computed(target, parameters)]);
}
function FromRef$4($ref) {
	return Computed("KeyOf", [Ref$1($ref)]);
}
function KeyOfFromType(type, options) {
	return CreateType(UnionEvaluated(KeyOfPropertyKeysToRest(KeyOfPropertyKeys(type))), options);
}
function KeyOfPropertyKeysToRest(propertyKeys) {
	return propertyKeys.map((L) => L === "[number]" ? Number$1() : Literal(L));
}
/** `[Json]` Creates a KeyOf type */
function KeyOf(type, options) {
	return IsComputed$1(type) ? FromComputed$3(type.target, type.parameters) : IsRef$1(type) ? FromRef$4(type.$ref) : IsMappedResult$1(type) ? KeyOfFromMappedResult(type, options) : KeyOfFromType(type, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/keyof/keyof-from-mapped-result.mjs
function FromProperties$13(properties, options) {
	const result = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(properties)) result[K2] = KeyOf(properties[K2], Clone(options));
	return result;
}
function FromMappedResult$7(mappedResult, options) {
	return FromProperties$13(mappedResult.properties, options);
}
function KeyOfFromMappedResult(mappedResult, options) {
	return MappedResult(FromMappedResult$7(mappedResult, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/composite/composite.mjs
function CompositeKeys(T) {
	const Acc = [];
	for (const L of T) Acc.push(...KeyOfPropertyKeys(L));
	return SetDistinct(Acc);
}
function FilterNever(T) {
	return T.filter((L) => !IsNever$1(L));
}
function CompositeProperty(T, K) {
	const Acc = [];
	for (const L of T) Acc.push(...IndexFromPropertyKeys(L, [K]));
	return FilterNever(Acc);
}
function CompositeProperties(T, K) {
	const Acc = {};
	for (const L of K) Acc[L] = IntersectEvaluated(CompositeProperty(T, L));
	return Acc;
}
function Composite(T, options) {
	return Object$1(CompositeProperties(T, CompositeKeys(T)), options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/date/date.mjs
/** `[JavaScript]` Creates a Date type */
function Date$1(options) {
	return CreateType({
		[Kind]: "Date",
		type: "Date"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/null/null.mjs
/** `[Json]` Creates a Null type */
function Null(options) {
	return CreateType({
		[Kind]: "Null",
		type: "null"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/symbol/symbol.mjs
/** `[JavaScript]` Creates a Symbol type */
function Symbol$1(options) {
	return CreateType({
		[Kind]: "Symbol",
		type: "symbol"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/undefined/undefined.mjs
/** `[JavaScript]` Creates a Undefined type */
function Undefined(options) {
	return CreateType({
		[Kind]: "Undefined",
		type: "undefined"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/uint8array/uint8array.mjs
/** `[JavaScript]` Creates a Uint8Array type */
function Uint8Array$1(options) {
	return CreateType({
		[Kind]: "Uint8Array",
		type: "Uint8Array"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/unknown/unknown.mjs
/** `[Json]` Creates an Unknown type */
function Unknown(options) {
	return CreateType({ [Kind]: "Unknown" }, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/const/const.mjs
function FromArray$5(T) {
	return T.map((L) => FromValue(L, false));
}
function FromProperties$12(value) {
	const Acc = {};
	for (const K of globalThis.Object.getOwnPropertyNames(value)) Acc[K] = Readonly(FromValue(value[K], false));
	return Acc;
}
function ConditionalReadonly(T, root) {
	return root === true ? T : Readonly(T);
}
function FromValue(value, root) {
	return IsAsyncIterator$3(value) ? ConditionalReadonly(Any(), root) : IsIterator$3(value) ? ConditionalReadonly(Any(), root) : IsArray$3(value) ? Readonly(Tuple(FromArray$5(value))) : IsUint8Array$3(value) ? Uint8Array$1() : IsDate$3(value) ? Date$1() : IsObject$3(value) ? ConditionalReadonly(Object$1(FromProperties$12(value)), root) : IsFunction$3(value) ? ConditionalReadonly(Function$1([], Unknown()), root) : IsUndefined$3(value) ? Undefined() : IsNull$3(value) ? Null() : IsSymbol$3(value) ? Symbol$1() : IsBigInt$3(value) ? BigInt$1() : IsNumber$3(value) ? Literal(value) : IsBoolean$3(value) ? Literal(value) : IsString$3(value) ? Literal(value) : Object$1({});
}
/** `[JavaScript]` Creates a readonly const type from the given value. */
function Const(T, options) {
	return CreateType(FromValue(T, true), options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/constructor-parameters/constructor-parameters.mjs
/** `[JavaScript]` Extracts the ConstructorParameters from the given Constructor type */
function ConstructorParameters(schema, options) {
	return IsConstructor$1(schema) ? Tuple(schema.parameters, options) : Never(options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/enum/enum.mjs
/** `[Json]` Creates a Enum type */
function Enum(item, options) {
	if (IsUndefined$3(item)) throw new Error("Enum undefined or empty");
	const values1 = globalThis.Object.getOwnPropertyNames(item).filter((key) => isNaN(key)).map((key) => item[key]);
	return Union$1([...new Set(values1)].map((value) => Literal(value)), {
		...options,
		[Hint]: "Enum"
	});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/extends/extends-check.mjs
var ExtendsResolverError = class extends TypeBoxError {};
var ExtendsResult;
(function(ExtendsResult) {
	ExtendsResult[ExtendsResult["Union"] = 0] = "Union";
	ExtendsResult[ExtendsResult["True"] = 1] = "True";
	ExtendsResult[ExtendsResult["False"] = 2] = "False";
})(ExtendsResult || (ExtendsResult = {}));
function IntoBooleanResult(result) {
	return result === ExtendsResult.False ? result : ExtendsResult.True;
}
function Throw(message) {
	throw new ExtendsResolverError(message);
}
function IsStructuralRight(right) {
	return IsNever(right) || IsIntersect(right) || IsUnion(right) || IsUnknown(right) || IsAny(right);
}
function StructuralRight(left, right) {
	return IsNever(right) ? FromNeverRight(left, right) : IsIntersect(right) ? FromIntersectRight(left, right) : IsUnion(right) ? FromUnionRight(left, right) : IsUnknown(right) ? FromUnknownRight(left, right) : IsAny(right) ? FromAnyRight(left, right) : Throw("StructuralRight");
}
function FromAnyRight(left, right) {
	return ExtendsResult.True;
}
function FromAny$2(left, right) {
	return IsIntersect(right) ? FromIntersectRight(left, right) : IsUnion(right) && right.anyOf.some((schema) => IsAny(schema) || IsUnknown(schema)) ? ExtendsResult.True : IsUnion(right) ? ExtendsResult.Union : IsUnknown(right) ? ExtendsResult.True : IsAny(right) ? ExtendsResult.True : ExtendsResult.Union;
}
function FromArrayRight(left, right) {
	return IsUnknown(left) ? ExtendsResult.False : IsAny(left) ? ExtendsResult.Union : IsNever(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromArray$4(left, right) {
	return IsObject(right) && IsObjectArrayLike(right) ? ExtendsResult.True : IsStructuralRight(right) ? StructuralRight(left, right) : !IsArray(right) ? ExtendsResult.False : IntoBooleanResult(Visit$3(left.items, right.items));
}
function FromAsyncIterator$4(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : !IsAsyncIterator(right) ? ExtendsResult.False : IntoBooleanResult(Visit$3(left.items, right.items));
}
function FromBigInt$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsBigInt(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromBooleanRight(left, right) {
	return IsLiteralBoolean(left) ? ExtendsResult.True : IsBoolean(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromBoolean$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsBoolean(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromConstructor$4(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : !IsConstructor(right) ? ExtendsResult.False : left.parameters.length > right.parameters.length ? ExtendsResult.False : !left.parameters.every((schema, index) => IntoBooleanResult(Visit$3(right.parameters[index], schema)) === ExtendsResult.True) ? ExtendsResult.False : IntoBooleanResult(Visit$3(left.returns, right.returns));
}
function FromDate$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsDate(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromFunction$4(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : !IsFunction(right) ? ExtendsResult.False : left.parameters.length > right.parameters.length ? ExtendsResult.False : !left.parameters.every((schema, index) => IntoBooleanResult(Visit$3(right.parameters[index], schema)) === ExtendsResult.True) ? ExtendsResult.False : IntoBooleanResult(Visit$3(left.returns, right.returns));
}
function FromIntegerRight(left, right) {
	return IsLiteral(left) && IsNumber$3(left.const) ? ExtendsResult.True : IsNumber(left) || IsInteger(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromInteger$2(left, right) {
	return IsInteger(right) || IsNumber(right) ? ExtendsResult.True : IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : ExtendsResult.False;
}
function FromIntersectRight(left, right) {
	return right.allOf.every((schema) => Visit$3(left, schema) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromIntersect$6(left, right) {
	return left.allOf.some((schema) => Visit$3(schema, right) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromIterator$4(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : !IsIterator(right) ? ExtendsResult.False : IntoBooleanResult(Visit$3(left.items, right.items));
}
function FromLiteral$2(left, right) {
	return IsLiteral(right) && right.const === left.const ? ExtendsResult.True : IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsString(right) ? FromStringRight(left, right) : IsNumber(right) ? FromNumberRight(left, right) : IsInteger(right) ? FromIntegerRight(left, right) : IsBoolean(right) ? FromBooleanRight(left, right) : ExtendsResult.False;
}
function FromNeverRight(left, right) {
	return ExtendsResult.False;
}
function FromNever$2(left, right) {
	return ExtendsResult.True;
}
function UnwrapTNot(schema) {
	let [current, depth] = [schema, 0];
	while (true) {
		if (!IsNot(current)) break;
		current = current.not;
		depth += 1;
	}
	return depth % 2 === 0 ? current : Unknown();
}
function FromNot$2(left, right) {
	return IsNot(left) ? Visit$3(UnwrapTNot(left), right) : IsNot(right) ? Visit$3(left, UnwrapTNot(right)) : Throw("Invalid fallthrough for Not");
}
function FromNull$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsNull(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromNumberRight(left, right) {
	return IsLiteralNumber(left) ? ExtendsResult.True : IsNumber(left) || IsInteger(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromNumber$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsInteger(right) || IsNumber(right) ? ExtendsResult.True : ExtendsResult.False;
}
function IsObjectPropertyCount(schema, count) {
	return Object.getOwnPropertyNames(schema.properties).length === count;
}
function IsObjectStringLike(schema) {
	return IsObjectArrayLike(schema);
}
function IsObjectSymbolLike(schema) {
	return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && "description" in schema.properties && IsUnion(schema.properties.description) && schema.properties.description.anyOf.length === 2 && (IsString(schema.properties.description.anyOf[0]) && IsUndefined(schema.properties.description.anyOf[1]) || IsString(schema.properties.description.anyOf[1]) && IsUndefined(schema.properties.description.anyOf[0]));
}
function IsObjectNumberLike(schema) {
	return IsObjectPropertyCount(schema, 0);
}
function IsObjectBooleanLike(schema) {
	return IsObjectPropertyCount(schema, 0);
}
function IsObjectBigIntLike(schema) {
	return IsObjectPropertyCount(schema, 0);
}
function IsObjectDateLike(schema) {
	return IsObjectPropertyCount(schema, 0);
}
function IsObjectUint8ArrayLike(schema) {
	return IsObjectArrayLike(schema);
}
function IsObjectFunctionLike(schema) {
	const length = Number$1();
	return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && "length" in schema.properties && IntoBooleanResult(Visit$3(schema.properties["length"], length)) === ExtendsResult.True;
}
function IsObjectConstructorLike(schema) {
	return IsObjectPropertyCount(schema, 0);
}
function IsObjectArrayLike(schema) {
	const length = Number$1();
	return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && "length" in schema.properties && IntoBooleanResult(Visit$3(schema.properties["length"], length)) === ExtendsResult.True;
}
function IsObjectPromiseLike(schema) {
	const then = Function$1([Any()], Any());
	return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && "then" in schema.properties && IntoBooleanResult(Visit$3(schema.properties["then"], then)) === ExtendsResult.True;
}
function Property(left, right) {
	return Visit$3(left, right) === ExtendsResult.False ? ExtendsResult.False : IsOptional(left) && !IsOptional(right) ? ExtendsResult.False : ExtendsResult.True;
}
function FromObjectRight(left, right) {
	return IsUnknown(left) ? ExtendsResult.False : IsAny(left) ? ExtendsResult.Union : IsNever(left) || IsLiteralString(left) && IsObjectStringLike(right) || IsLiteralNumber(left) && IsObjectNumberLike(right) || IsLiteralBoolean(left) && IsObjectBooleanLike(right) || IsSymbol(left) && IsObjectSymbolLike(right) || IsBigInt(left) && IsObjectBigIntLike(right) || IsString(left) && IsObjectStringLike(right) || IsSymbol(left) && IsObjectSymbolLike(right) || IsNumber(left) && IsObjectNumberLike(right) || IsInteger(left) && IsObjectNumberLike(right) || IsBoolean(left) && IsObjectBooleanLike(right) || IsUint8Array(left) && IsObjectUint8ArrayLike(right) || IsDate(left) && IsObjectDateLike(right) || IsConstructor(left) && IsObjectConstructorLike(right) || IsFunction(left) && IsObjectFunctionLike(right) ? ExtendsResult.True : IsRecord(left) && IsString(RecordKey$1(left)) ? (() => {
		return right[Hint] === "Record" ? ExtendsResult.True : ExtendsResult.False;
	})() : IsRecord(left) && IsNumber(RecordKey$1(left)) ? (() => {
		return IsObjectPropertyCount(right, 0) ? ExtendsResult.True : ExtendsResult.False;
	})() : ExtendsResult.False;
}
function FromObject$8(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : !IsObject(right) ? ExtendsResult.False : (() => {
		for (const key of Object.getOwnPropertyNames(right.properties)) {
			if (!(key in left.properties) && !IsOptional(right.properties[key])) return ExtendsResult.False;
			if (IsOptional(right.properties[key])) return ExtendsResult.True;
			if (Property(left.properties[key], right.properties[key]) === ExtendsResult.False) return ExtendsResult.False;
		}
		return ExtendsResult.True;
	})();
}
function FromPromise$3(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) && IsObjectPromiseLike(right) ? ExtendsResult.True : !IsPromise(right) ? ExtendsResult.False : IntoBooleanResult(Visit$3(left.item, right.item));
}
function RecordKey$1(schema) {
	return PatternNumberExact in schema.patternProperties ? Number$1() : PatternStringExact in schema.patternProperties ? String$1() : Throw("Unknown record key pattern");
}
function RecordValue$1(schema) {
	return PatternNumberExact in schema.patternProperties ? schema.patternProperties[PatternNumberExact] : PatternStringExact in schema.patternProperties ? schema.patternProperties[PatternStringExact] : Throw("Unable to get record value schema");
}
function FromRecordRight(left, right) {
	const [Key, Value] = [RecordKey$1(right), RecordValue$1(right)];
	return IsLiteralString(left) && IsNumber(Key) && IntoBooleanResult(Visit$3(left, Value)) === ExtendsResult.True ? ExtendsResult.True : IsUint8Array(left) && IsNumber(Key) ? Visit$3(left, Value) : IsString(left) && IsNumber(Key) ? Visit$3(left, Value) : IsArray(left) && IsNumber(Key) ? Visit$3(left, Value) : IsObject(left) ? (() => {
		for (const key of Object.getOwnPropertyNames(left.properties)) if (Property(Value, left.properties[key]) === ExtendsResult.False) return ExtendsResult.False;
		return ExtendsResult.True;
	})() : ExtendsResult.False;
}
function FromRecord$4(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : !IsRecord(right) ? ExtendsResult.False : Visit$3(RecordValue$1(left), RecordValue$1(right));
}
function FromRegExp$2(left, right) {
	return Visit$3(IsRegExp(left) ? String$1() : left, IsRegExp(right) ? String$1() : right);
}
function FromStringRight(left, right) {
	return IsLiteral(left) && IsString$3(left.const) ? ExtendsResult.True : IsString(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromString$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsString(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromSymbol$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsSymbol(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromTemplateLiteral$3(left, right) {
	return IsTemplateLiteral(left) ? Visit$3(TemplateLiteralToUnion(left), right) : IsTemplateLiteral(right) ? Visit$3(left, TemplateLiteralToUnion(right)) : Throw("Invalid fallthrough for TemplateLiteral");
}
function IsArrayOfTuple(left, right) {
	return IsArray(right) && left.items !== void 0 && left.items.every((schema) => Visit$3(schema, right.items) === ExtendsResult.True);
}
function FromTupleRight(left, right) {
	return IsNever(left) ? ExtendsResult.True : IsUnknown(left) ? ExtendsResult.False : IsAny(left) ? ExtendsResult.Union : ExtendsResult.False;
}
function FromTuple$4(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) && IsObjectArrayLike(right) ? ExtendsResult.True : IsArray(right) && IsArrayOfTuple(left, right) ? ExtendsResult.True : !IsTuple(right) ? ExtendsResult.False : IsUndefined$3(left.items) && !IsUndefined$3(right.items) || !IsUndefined$3(left.items) && IsUndefined$3(right.items) ? ExtendsResult.False : IsUndefined$3(left.items) && !IsUndefined$3(right.items) ? ExtendsResult.True : left.items.every((schema, index) => Visit$3(schema, right.items[index]) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUint8Array$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsUint8Array(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUndefined$2(left, right) {
	return IsStructuralRight(right) ? StructuralRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsRecord(right) ? FromRecordRight(left, right) : IsVoid(right) ? FromVoidRight(left, right) : IsUndefined(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUnionRight(left, right) {
	return right.anyOf.some((schema) => Visit$3(left, schema) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUnion$6(left, right) {
	return left.anyOf.every((schema) => Visit$3(schema, right) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUnknownRight(left, right) {
	return ExtendsResult.True;
}
function FromUnknown$2(left, right) {
	return IsNever(right) ? FromNeverRight(left, right) : IsIntersect(right) ? FromIntersectRight(left, right) : IsUnion(right) ? FromUnionRight(left, right) : IsAny(right) ? FromAnyRight(left, right) : IsString(right) ? FromStringRight(left, right) : IsNumber(right) ? FromNumberRight(left, right) : IsInteger(right) ? FromIntegerRight(left, right) : IsBoolean(right) ? FromBooleanRight(left, right) : IsArray(right) ? FromArrayRight(left, right) : IsTuple(right) ? FromTupleRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsUnknown(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromVoidRight(left, right) {
	return IsUndefined(left) ? ExtendsResult.True : IsUndefined(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromVoid$2(left, right) {
	return IsIntersect(right) ? FromIntersectRight(left, right) : IsUnion(right) ? FromUnionRight(left, right) : IsUnknown(right) ? FromUnknownRight(left, right) : IsAny(right) ? FromAnyRight(left, right) : IsObject(right) ? FromObjectRight(left, right) : IsVoid(right) ? ExtendsResult.True : ExtendsResult.False;
}
function Visit$3(left, right) {
	return IsTemplateLiteral(left) || IsTemplateLiteral(right) ? FromTemplateLiteral$3(left, right) : IsRegExp(left) || IsRegExp(right) ? FromRegExp$2(left, right) : IsNot(left) || IsNot(right) ? FromNot$2(left, right) : IsAny(left) ? FromAny$2(left, right) : IsArray(left) ? FromArray$4(left, right) : IsBigInt(left) ? FromBigInt$2(left, right) : IsBoolean(left) ? FromBoolean$2(left, right) : IsAsyncIterator(left) ? FromAsyncIterator$4(left, right) : IsConstructor(left) ? FromConstructor$4(left, right) : IsDate(left) ? FromDate$2(left, right) : IsFunction(left) ? FromFunction$4(left, right) : IsInteger(left) ? FromInteger$2(left, right) : IsIntersect(left) ? FromIntersect$6(left, right) : IsIterator(left) ? FromIterator$4(left, right) : IsLiteral(left) ? FromLiteral$2(left, right) : IsNever(left) ? FromNever$2(left, right) : IsNull(left) ? FromNull$2(left, right) : IsNumber(left) ? FromNumber$2(left, right) : IsObject(left) ? FromObject$8(left, right) : IsRecord(left) ? FromRecord$4(left, right) : IsString(left) ? FromString$2(left, right) : IsSymbol(left) ? FromSymbol$2(left, right) : IsTuple(left) ? FromTuple$4(left, right) : IsPromise(left) ? FromPromise$3(left, right) : IsUint8Array(left) ? FromUint8Array$2(left, right) : IsUndefined(left) ? FromUndefined$2(left, right) : IsUnion(left) ? FromUnion$6(left, right) : IsUnknown(left) ? FromUnknown$2(left, right) : IsVoid(left) ? FromVoid$2(left, right) : Throw(`Unknown left type operand '${left[Kind]}'`);
}
function ExtendsCheck(left, right) {
	return Visit$3(left, right);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/extends/extends-from-mapped-result.mjs
function FromProperties$11(P, Right, True, False, options) {
	const Acc = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Extends(P[K2], Right, True, False, Clone(options));
	return Acc;
}
function FromMappedResult$6(Left, Right, True, False, options) {
	return FromProperties$11(Left.properties, Right, True, False, options);
}
function ExtendsFromMappedResult(Left, Right, True, False, options) {
	return MappedResult(FromMappedResult$6(Left, Right, True, False, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/extends/extends.mjs
function ExtendsResolve(left, right, trueType, falseType) {
	const R = ExtendsCheck(left, right);
	return R === ExtendsResult.Union ? Union$1([trueType, falseType]) : R === ExtendsResult.True ? trueType : falseType;
}
/** `[Json]` Creates a Conditional type */
function Extends(L, R, T, F, options) {
	return IsMappedResult$1(L) ? ExtendsFromMappedResult(L, R, T, F, options) : IsMappedKey$1(L) ? CreateType(ExtendsFromMappedKey(L, R, T, F, options)) : CreateType(ExtendsResolve(L, R, T, F), options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/extends/extends-from-mapped-key.mjs
function FromPropertyKey$2(K, U, L, R, options) {
	return { [K]: Extends(Literal(K), U, L, R, Clone(options)) };
}
function FromPropertyKeys$2(K, U, L, R, options) {
	return K.reduce((Acc, LK) => {
		return {
			...Acc,
			...FromPropertyKey$2(LK, U, L, R, options)
		};
	}, {});
}
function FromMappedKey$2(K, U, L, R, options) {
	return FromPropertyKeys$2(K.keys, U, L, R, options);
}
function ExtendsFromMappedKey(T, U, L, R, options) {
	return MappedResult(FromMappedKey$2(T, U, L, R, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/extends/extends-undefined.mjs
/** Fast undefined check used for properties of type undefined */
function Intersect(schema) {
	return schema.allOf.every((schema) => ExtendsUndefinedCheck(schema));
}
function Union(schema) {
	return schema.anyOf.some((schema) => ExtendsUndefinedCheck(schema));
}
function Not$1(schema) {
	return !ExtendsUndefinedCheck(schema.not);
}
/** Fast undefined check used for properties of type undefined */
function ExtendsUndefinedCheck(schema) {
	return schema[Kind] === "Intersect" ? Intersect(schema) : schema[Kind] === "Union" ? Union(schema) : schema[Kind] === "Not" ? Not$1(schema) : schema[Kind] === "Undefined" ? true : false;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/exclude/exclude-from-template-literal.mjs
function ExcludeFromTemplateLiteral(L, R) {
	return Exclude(TemplateLiteralToUnion(L), R);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/exclude/exclude.mjs
function ExcludeRest(L, R) {
	const excluded = L.filter((inner) => ExtendsCheck(inner, R) === ExtendsResult.False);
	return excluded.length === 1 ? excluded[0] : Union$1(excluded);
}
/** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
function Exclude(L, R, options = {}) {
	if (IsTemplateLiteral$1(L)) return CreateType(ExcludeFromTemplateLiteral(L, R), options);
	if (IsMappedResult$1(L)) return CreateType(ExcludeFromMappedResult(L, R), options);
	return CreateType(IsUnion$1(L) ? ExcludeRest(L.anyOf, R) : ExtendsCheck(L, R) !== ExtendsResult.False ? Never() : L, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/exclude/exclude-from-mapped-result.mjs
function FromProperties$10(P, U) {
	const Acc = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Exclude(P[K2], U);
	return Acc;
}
function FromMappedResult$5(R, T) {
	return FromProperties$10(R.properties, T);
}
function ExcludeFromMappedResult(R, T) {
	return MappedResult(FromMappedResult$5(R, T));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/extract/extract-from-template-literal.mjs
function ExtractFromTemplateLiteral(L, R) {
	return Extract(TemplateLiteralToUnion(L), R);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/extract/extract.mjs
function ExtractRest(L, R) {
	const extracted = L.filter((inner) => ExtendsCheck(inner, R) !== ExtendsResult.False);
	return extracted.length === 1 ? extracted[0] : Union$1(extracted);
}
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
function Extract(L, R, options) {
	if (IsTemplateLiteral$1(L)) return CreateType(ExtractFromTemplateLiteral(L, R), options);
	if (IsMappedResult$1(L)) return CreateType(ExtractFromMappedResult(L, R), options);
	return CreateType(IsUnion$1(L) ? ExtractRest(L.anyOf, R) : ExtendsCheck(L, R) !== ExtendsResult.False ? L : Never(), options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/extract/extract-from-mapped-result.mjs
function FromProperties$9(P, T) {
	const Acc = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Extract(P[K2], T);
	return Acc;
}
function FromMappedResult$4(R, T) {
	return FromProperties$9(R.properties, T);
}
function ExtractFromMappedResult(R, T) {
	return MappedResult(FromMappedResult$4(R, T));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/instance-type/instance-type.mjs
/** `[JavaScript]` Extracts the InstanceType from the given Constructor type */
function InstanceType(schema, options) {
	return IsConstructor$1(schema) ? CreateType(schema.returns, options) : Never(options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/readonly-optional/readonly-optional.mjs
/** `[Json]` Creates a Readonly and Optional property */
function ReadonlyOptional(schema) {
	return Readonly(Optional(schema));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/record/record.mjs
function RecordCreateFromPattern(pattern, T, options) {
	return CreateType({
		[Kind]: "Record",
		type: "object",
		patternProperties: { [pattern]: T }
	}, options);
}
function RecordCreateFromKeys(K, T, options) {
	const result = {};
	for (const K2 of K) result[K2] = T;
	return Object$1(result, {
		...options,
		[Hint]: "Record"
	});
}
function FromTemplateLiteralKey(K, T, options) {
	return IsTemplateLiteralFinite(K) ? RecordCreateFromKeys(IndexPropertyKeys(K), T, options) : RecordCreateFromPattern(K.pattern, T, options);
}
function FromUnionKey(key, type, options) {
	return RecordCreateFromKeys(IndexPropertyKeys(Union$1(key)), type, options);
}
function FromLiteralKey(key, type, options) {
	return RecordCreateFromKeys([key.toString()], type, options);
}
function FromRegExpKey(key, type, options) {
	return RecordCreateFromPattern(key.source, type, options);
}
function FromStringKey(key, type, options) {
	return RecordCreateFromPattern(IsUndefined$3(key.pattern) ? PatternStringExact : key.pattern, type, options);
}
function FromAnyKey(_, type, options) {
	return RecordCreateFromPattern(PatternStringExact, type, options);
}
function FromNeverKey(_key, type, options) {
	return RecordCreateFromPattern(PatternNeverExact, type, options);
}
function FromBooleanKey(_key, type, options) {
	return Object$1({
		true: type,
		false: type
	}, options);
}
function FromIntegerKey(_key, type, options) {
	return RecordCreateFromPattern(PatternNumberExact, type, options);
}
function FromNumberKey(_, type, options) {
	return RecordCreateFromPattern(PatternNumberExact, type, options);
}
/** `[Json]` Creates a Record type */
function Record(key, type, options = {}) {
	return IsUnion$1(key) ? FromUnionKey(key.anyOf, type, options) : IsTemplateLiteral$1(key) ? FromTemplateLiteralKey(key, type, options) : IsLiteral$1(key) ? FromLiteralKey(key.const, type, options) : IsBoolean$1(key) ? FromBooleanKey(key, type, options) : IsInteger$1(key) ? FromIntegerKey(key, type, options) : IsNumber$1(key) ? FromNumberKey(key, type, options) : IsRegExp$1(key) ? FromRegExpKey(key, type, options) : IsString$1(key) ? FromStringKey(key, type, options) : IsAny$1(key) ? FromAnyKey(key, type, options) : IsNever$1(key) ? FromNeverKey(key, type, options) : Never(options);
}
/** Gets the Records Pattern */
function RecordPattern(record) {
	return globalThis.Object.getOwnPropertyNames(record.patternProperties)[0];
}
/** Gets the Records Key Type */
function RecordKey(type) {
	const pattern = RecordPattern(type);
	return pattern === PatternStringExact ? String$1() : pattern === PatternNumberExact ? Number$1() : String$1({ pattern });
}
/** Gets a Record Value Type */
function RecordValue(type) {
	return type.patternProperties[RecordPattern(type)];
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/instantiate/instantiate.mjs
function FromConstructor$3(args, type) {
	type.parameters = FromTypes$1(args, type.parameters);
	type.returns = FromType$1(args, type.returns);
	return type;
}
function FromFunction$3(args, type) {
	type.parameters = FromTypes$1(args, type.parameters);
	type.returns = FromType$1(args, type.returns);
	return type;
}
function FromIntersect$5(args, type) {
	type.allOf = FromTypes$1(args, type.allOf);
	return type;
}
function FromUnion$5(args, type) {
	type.anyOf = FromTypes$1(args, type.anyOf);
	return type;
}
function FromTuple$3(args, type) {
	if (IsUndefined$3(type.items)) return type;
	type.items = FromTypes$1(args, type.items);
	return type;
}
function FromArray$3(args, type) {
	type.items = FromType$1(args, type.items);
	return type;
}
function FromAsyncIterator$3(args, type) {
	type.items = FromType$1(args, type.items);
	return type;
}
function FromIterator$3(args, type) {
	type.items = FromType$1(args, type.items);
	return type;
}
function FromPromise$2(args, type) {
	type.item = FromType$1(args, type.item);
	return type;
}
function FromObject$7(args, type) {
	const mappedProperties = FromProperties$8(args, type.properties);
	return {
		...type,
		...Object$1(mappedProperties)
	};
}
function FromRecord$3(args, type) {
	const result = Record(FromType$1(args, RecordKey(type)), FromType$1(args, RecordValue(type)));
	return {
		...type,
		...result
	};
}
function FromArgument$2(args, argument) {
	return argument.index in args ? args[argument.index] : Unknown();
}
function FromProperty$1(args, type) {
	const isReadonly = IsReadonly(type);
	const isOptional = IsOptional$1(type);
	const mapped = FromType$1(args, type);
	return isReadonly && isOptional ? ReadonlyOptional(mapped) : isReadonly && !isOptional ? Readonly(mapped) : !isReadonly && isOptional ? Optional(mapped) : mapped;
}
function FromProperties$8(args, properties) {
	return globalThis.Object.getOwnPropertyNames(properties).reduce((result, key) => {
		return {
			...result,
			[key]: FromProperty$1(args, properties[key])
		};
	}, {});
}
function FromTypes$1(args, types) {
	return types.map((type) => FromType$1(args, type));
}
function FromType$1(args, type) {
	return IsConstructor$1(type) ? FromConstructor$3(args, type) : IsFunction$1(type) ? FromFunction$3(args, type) : IsIntersect$1(type) ? FromIntersect$5(args, type) : IsUnion$1(type) ? FromUnion$5(args, type) : IsTuple$1(type) ? FromTuple$3(args, type) : IsArray$1(type) ? FromArray$3(args, type) : IsAsyncIterator$1(type) ? FromAsyncIterator$3(args, type) : IsIterator$1(type) ? FromIterator$3(args, type) : IsPromise$1(type) ? FromPromise$2(args, type) : IsObject$1(type) ? FromObject$7(args, type) : IsRecord$1(type) ? FromRecord$3(args, type) : IsArgument$1(type) ? FromArgument$2(args, type) : type;
}
/** `[JavaScript]` Instantiates a type with the given parameters */
function Instantiate(type, args) {
	return FromType$1(args, CloneType(type));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/integer/integer.mjs
/** `[Json]` Creates an Integer type */
function Integer(options) {
	return CreateType({
		[Kind]: "Integer",
		type: "integer"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intrinsic/intrinsic-from-mapped-key.mjs
function MappedIntrinsicPropertyKey(K, M, options) {
	return { [K]: Intrinsic(Literal(K), M, Clone(options)) };
}
function MappedIntrinsicPropertyKeys(K, M, options) {
	return K.reduce((Acc, L) => {
		return {
			...Acc,
			...MappedIntrinsicPropertyKey(L, M, options)
		};
	}, {});
}
function MappedIntrinsicProperties(T, M, options) {
	return MappedIntrinsicPropertyKeys(T["keys"], M, options);
}
function IntrinsicFromMappedKey(T, M, options) {
	return MappedResult(MappedIntrinsicProperties(T, M, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intrinsic/intrinsic.mjs
function ApplyUncapitalize(value) {
	const [first, rest] = [value.slice(0, 1), value.slice(1)];
	return [first.toLowerCase(), rest].join("");
}
function ApplyCapitalize(value) {
	const [first, rest] = [value.slice(0, 1), value.slice(1)];
	return [first.toUpperCase(), rest].join("");
}
function ApplyUppercase(value) {
	return value.toUpperCase();
}
function ApplyLowercase(value) {
	return value.toLowerCase();
}
function FromTemplateLiteral$2(schema, mode, options) {
	const expression = TemplateLiteralParseExact(schema.pattern);
	if (!IsTemplateLiteralExpressionFinite(expression)) return {
		...schema,
		pattern: FromLiteralValue(schema.pattern, mode)
	};
	return TemplateLiteral([Union$1(FromRest$2([...TemplateLiteralExpressionGenerate(expression)].map((value) => Literal(value)), mode))], options);
}
function FromLiteralValue(value, mode) {
	return typeof value === "string" ? mode === "Uncapitalize" ? ApplyUncapitalize(value) : mode === "Capitalize" ? ApplyCapitalize(value) : mode === "Uppercase" ? ApplyUppercase(value) : mode === "Lowercase" ? ApplyLowercase(value) : value : value.toString();
}
function FromRest$2(T, M) {
	return T.map((L) => Intrinsic(L, M));
}
/** Applies an intrinsic string manipulation to the given type. */
function Intrinsic(schema, mode, options = {}) {
	return IsMappedKey$1(schema) ? IntrinsicFromMappedKey(schema, mode, options) : IsTemplateLiteral$1(schema) ? FromTemplateLiteral$2(schema, mode, options) : IsUnion$1(schema) ? Union$1(FromRest$2(schema.anyOf, mode), options) : IsLiteral$1(schema) ? Literal(FromLiteralValue(schema.const, mode), options) : CreateType(schema, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intrinsic/capitalize.mjs
/** `[Json]` Intrinsic function to Capitalize LiteralString types */
function Capitalize(T, options = {}) {
	return Intrinsic(T, "Capitalize", options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intrinsic/lowercase.mjs
/** `[Json]` Intrinsic function to Lowercase LiteralString types */
function Lowercase(T, options = {}) {
	return Intrinsic(T, "Lowercase", options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intrinsic/uncapitalize.mjs
/** `[Json]` Intrinsic function to Uncapitalize LiteralString types */
function Uncapitalize(T, options = {}) {
	return Intrinsic(T, "Uncapitalize", options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/intrinsic/uppercase.mjs
/** `[Json]` Intrinsic function to Uppercase LiteralString types */
function Uppercase(T, options = {}) {
	return Intrinsic(T, "Uppercase", options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/omit/omit-from-mapped-result.mjs
function FromProperties$7(properties, propertyKeys, options) {
	const result = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(properties)) result[K2] = Omit(properties[K2], propertyKeys, Clone(options));
	return result;
}
function FromMappedResult$3(mappedResult, propertyKeys, options) {
	return FromProperties$7(mappedResult.properties, propertyKeys, options);
}
function OmitFromMappedResult(mappedResult, propertyKeys, options) {
	return MappedResult(FromMappedResult$3(mappedResult, propertyKeys, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/omit/omit.mjs
function FromIntersect$4(types, propertyKeys) {
	return types.map((type) => OmitResolve(type, propertyKeys));
}
function FromUnion$4(types, propertyKeys) {
	return types.map((type) => OmitResolve(type, propertyKeys));
}
function FromProperty(properties, key) {
	const { [key]: _, ...R } = properties;
	return R;
}
function FromProperties$6(properties, propertyKeys) {
	return propertyKeys.reduce((T, K2) => FromProperty(T, K2), properties);
}
function FromObject$6(type, propertyKeys, properties) {
	const options = Discard(type, [
		TransformKind,
		"$id",
		"required",
		"properties"
	]);
	return Object$1(FromProperties$6(properties, propertyKeys), options);
}
function UnionFromPropertyKeys$1(propertyKeys) {
	return Union$1(propertyKeys.reduce((result, key) => IsLiteralValue$1(key) ? [...result, Literal(key)] : result, []));
}
function OmitResolve(type, propertyKeys) {
	return IsIntersect$1(type) ? Intersect$1(FromIntersect$4(type.allOf, propertyKeys)) : IsUnion$1(type) ? Union$1(FromUnion$4(type.anyOf, propertyKeys)) : IsObject$1(type) ? FromObject$6(type, propertyKeys, type.properties) : Object$1({});
}
/** `[Json]` Constructs a type whose keys are picked from the given type */
function Omit(type, key, options) {
	const typeKey = IsArray$3(key) ? UnionFromPropertyKeys$1(key) : key;
	const propertyKeys = IsSchema$1(key) ? IndexPropertyKeys(key) : key;
	const isTypeRef = IsRef$1(type);
	const isKeyRef = IsRef$1(key);
	return IsMappedResult$1(type) ? OmitFromMappedResult(type, propertyKeys, options) : IsMappedKey$1(key) ? OmitFromMappedKey(type, key, options) : isTypeRef && isKeyRef ? Computed("Omit", [type, typeKey], options) : !isTypeRef && isKeyRef ? Computed("Omit", [type, typeKey], options) : isTypeRef && !isKeyRef ? Computed("Omit", [type, typeKey], options) : CreateType({
		...OmitResolve(type, propertyKeys),
		...options
	});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/omit/omit-from-mapped-key.mjs
function FromPropertyKey$1(type, key, options) {
	return { [key]: Omit(type, [key], Clone(options)) };
}
function FromPropertyKeys$1(type, propertyKeys, options) {
	return propertyKeys.reduce((Acc, LK) => {
		return {
			...Acc,
			...FromPropertyKey$1(type, LK, options)
		};
	}, {});
}
function FromMappedKey$1(type, mappedKey, options) {
	return FromPropertyKeys$1(type, mappedKey.keys, options);
}
function OmitFromMappedKey(type, mappedKey, options) {
	return MappedResult(FromMappedKey$1(type, mappedKey, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/pick/pick-from-mapped-result.mjs
function FromProperties$5(properties, propertyKeys, options) {
	const result = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(properties)) result[K2] = Pick(properties[K2], propertyKeys, Clone(options));
	return result;
}
function FromMappedResult$2(mappedResult, propertyKeys, options) {
	return FromProperties$5(mappedResult.properties, propertyKeys, options);
}
function PickFromMappedResult(mappedResult, propertyKeys, options) {
	return MappedResult(FromMappedResult$2(mappedResult, propertyKeys, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/pick/pick.mjs
function FromIntersect$3(types, propertyKeys) {
	return types.map((type) => PickResolve(type, propertyKeys));
}
function FromUnion$3(types, propertyKeys) {
	return types.map((type) => PickResolve(type, propertyKeys));
}
function FromProperties$4(properties, propertyKeys) {
	const result = {};
	for (const K2 of propertyKeys) if (K2 in properties) result[K2] = properties[K2];
	return result;
}
function FromObject$5(Type, keys, properties) {
	const options = Discard(Type, [
		TransformKind,
		"$id",
		"required",
		"properties"
	]);
	return Object$1(FromProperties$4(properties, keys), options);
}
function UnionFromPropertyKeys(propertyKeys) {
	return Union$1(propertyKeys.reduce((result, key) => IsLiteralValue$1(key) ? [...result, Literal(key)] : result, []));
}
function PickResolve(type, propertyKeys) {
	return IsIntersect$1(type) ? Intersect$1(FromIntersect$3(type.allOf, propertyKeys)) : IsUnion$1(type) ? Union$1(FromUnion$3(type.anyOf, propertyKeys)) : IsObject$1(type) ? FromObject$5(type, propertyKeys, type.properties) : Object$1({});
}
/** `[Json]` Constructs a type whose keys are picked from the given type */
function Pick(type, key, options) {
	const typeKey = IsArray$3(key) ? UnionFromPropertyKeys(key) : key;
	const propertyKeys = IsSchema$1(key) ? IndexPropertyKeys(key) : key;
	const isTypeRef = IsRef$1(type);
	const isKeyRef = IsRef$1(key);
	return IsMappedResult$1(type) ? PickFromMappedResult(type, propertyKeys, options) : IsMappedKey$1(key) ? PickFromMappedKey(type, key, options) : isTypeRef && isKeyRef ? Computed("Pick", [type, typeKey], options) : !isTypeRef && isKeyRef ? Computed("Pick", [type, typeKey], options) : isTypeRef && !isKeyRef ? Computed("Pick", [type, typeKey], options) : CreateType({
		...PickResolve(type, propertyKeys),
		...options
	});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/pick/pick-from-mapped-key.mjs
function FromPropertyKey(type, key, options) {
	return { [key]: Pick(type, [key], Clone(options)) };
}
function FromPropertyKeys(type, propertyKeys, options) {
	return propertyKeys.reduce((result, leftKey) => {
		return {
			...result,
			...FromPropertyKey(type, leftKey, options)
		};
	}, {});
}
function FromMappedKey(type, mappedKey, options) {
	return FromPropertyKeys(type, mappedKey.keys, options);
}
function PickFromMappedKey(type, mappedKey, options) {
	return MappedResult(FromMappedKey(type, mappedKey, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/partial/partial.mjs
function FromComputed$2(target, parameters) {
	return Computed("Partial", [Computed(target, parameters)]);
}
function FromRef$3($ref) {
	return Computed("Partial", [Ref$1($ref)]);
}
function FromProperties$3(properties) {
	const partialProperties = {};
	for (const K of globalThis.Object.getOwnPropertyNames(properties)) partialProperties[K] = Optional(properties[K]);
	return partialProperties;
}
function FromObject$4(type, properties) {
	const options = Discard(type, [
		TransformKind,
		"$id",
		"required",
		"properties"
	]);
	return Object$1(FromProperties$3(properties), options);
}
function FromRest$1(types) {
	return types.map((type) => PartialResolve(type));
}
function PartialResolve(type) {
	return IsComputed$1(type) ? FromComputed$2(type.target, type.parameters) : IsRef$1(type) ? FromRef$3(type.$ref) : IsIntersect$1(type) ? Intersect$1(FromRest$1(type.allOf)) : IsUnion$1(type) ? Union$1(FromRest$1(type.anyOf)) : IsObject$1(type) ? FromObject$4(type, type.properties) : IsBigInt$1(type) ? type : IsBoolean$1(type) ? type : IsInteger$1(type) ? type : IsLiteral$1(type) ? type : IsNull$1(type) ? type : IsNumber$1(type) ? type : IsString$1(type) ? type : IsSymbol$1(type) ? type : IsUndefined$1(type) ? type : Object$1({});
}
/** `[Json]` Constructs a type where all properties are optional */
function Partial(type, options) {
	if (IsMappedResult$1(type)) return PartialFromMappedResult(type, options);
	else return CreateType({
		...PartialResolve(type),
		...options
	});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/partial/partial-from-mapped-result.mjs
function FromProperties$2(K, options) {
	const Acc = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(K)) Acc[K2] = Partial(K[K2], Clone(options));
	return Acc;
}
function FromMappedResult$1(R, options) {
	return FromProperties$2(R.properties, options);
}
function PartialFromMappedResult(R, options) {
	return MappedResult(FromMappedResult$1(R, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/required/required.mjs
function FromComputed$1(target, parameters) {
	return Computed("Required", [Computed(target, parameters)]);
}
function FromRef$2($ref) {
	return Computed("Required", [Ref$1($ref)]);
}
function FromProperties$1(properties) {
	const requiredProperties = {};
	for (const K of globalThis.Object.getOwnPropertyNames(properties)) requiredProperties[K] = Discard(properties[K], [OptionalKind]);
	return requiredProperties;
}
function FromObject$3(type, properties) {
	const options = Discard(type, [
		TransformKind,
		"$id",
		"required",
		"properties"
	]);
	return Object$1(FromProperties$1(properties), options);
}
function FromRest(types) {
	return types.map((type) => RequiredResolve(type));
}
function RequiredResolve(type) {
	return IsComputed$1(type) ? FromComputed$1(type.target, type.parameters) : IsRef$1(type) ? FromRef$2(type.$ref) : IsIntersect$1(type) ? Intersect$1(FromRest(type.allOf)) : IsUnion$1(type) ? Union$1(FromRest(type.anyOf)) : IsObject$1(type) ? FromObject$3(type, type.properties) : IsBigInt$1(type) ? type : IsBoolean$1(type) ? type : IsInteger$1(type) ? type : IsLiteral$1(type) ? type : IsNull$1(type) ? type : IsNumber$1(type) ? type : IsString$1(type) ? type : IsSymbol$1(type) ? type : IsUndefined$1(type) ? type : Object$1({});
}
/** `[Json]` Constructs a type where all properties are required */
function Required(type, options) {
	if (IsMappedResult$1(type)) return RequiredFromMappedResult(type, options);
	else return CreateType({
		...RequiredResolve(type),
		...options
	});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/required/required-from-mapped-result.mjs
function FromProperties(P, options) {
	const Acc = {};
	for (const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Required(P[K2], options);
	return Acc;
}
function FromMappedResult(R, options) {
	return FromProperties(R.properties, options);
}
function RequiredFromMappedResult(R, options) {
	return MappedResult(FromMappedResult(R, options));
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/module/compute.mjs
function DereferenceParameters(moduleProperties, types) {
	return types.map((type) => {
		return IsRef$1(type) ? Dereference(moduleProperties, type.$ref) : FromType(moduleProperties, type);
	});
}
function Dereference(moduleProperties, ref) {
	return ref in moduleProperties ? IsRef$1(moduleProperties[ref]) ? Dereference(moduleProperties, moduleProperties[ref].$ref) : FromType(moduleProperties, moduleProperties[ref]) : Never();
}
function FromAwaited(parameters) {
	return Awaited(parameters[0]);
}
function FromIndex(parameters) {
	return Index(parameters[0], parameters[1]);
}
function FromKeyOf(parameters) {
	return KeyOf(parameters[0]);
}
function FromPartial(parameters) {
	return Partial(parameters[0]);
}
function FromOmit(parameters) {
	return Omit(parameters[0], parameters[1]);
}
function FromPick(parameters) {
	return Pick(parameters[0], parameters[1]);
}
function FromRequired(parameters) {
	return Required(parameters[0]);
}
function FromComputed(moduleProperties, target, parameters) {
	const dereferenced = DereferenceParameters(moduleProperties, parameters);
	return target === "Awaited" ? FromAwaited(dereferenced) : target === "Index" ? FromIndex(dereferenced) : target === "KeyOf" ? FromKeyOf(dereferenced) : target === "Partial" ? FromPartial(dereferenced) : target === "Omit" ? FromOmit(dereferenced) : target === "Pick" ? FromPick(dereferenced) : target === "Required" ? FromRequired(dereferenced) : Never();
}
function FromArray$2(moduleProperties, type) {
	return Array$1(FromType(moduleProperties, type));
}
function FromAsyncIterator$2(moduleProperties, type) {
	return AsyncIterator(FromType(moduleProperties, type));
}
function FromConstructor$2(moduleProperties, parameters, instanceType) {
	return Constructor(FromTypes(moduleProperties, parameters), FromType(moduleProperties, instanceType));
}
function FromFunction$2(moduleProperties, parameters, returnType) {
	return Function$1(FromTypes(moduleProperties, parameters), FromType(moduleProperties, returnType));
}
function FromIntersect$2(moduleProperties, types) {
	return Intersect$1(FromTypes(moduleProperties, types));
}
function FromIterator$2(moduleProperties, type) {
	return Iterator(FromType(moduleProperties, type));
}
function FromObject$2(moduleProperties, properties) {
	return Object$1(globalThis.Object.keys(properties).reduce((result, key) => {
		return {
			...result,
			[key]: FromType(moduleProperties, properties[key])
		};
	}, {}));
}
function FromRecord$2(moduleProperties, type) {
	const [value, pattern] = [FromType(moduleProperties, RecordValue(type)), RecordPattern(type)];
	const result = CloneType(type);
	result.patternProperties[pattern] = value;
	return result;
}
function FromTransform(moduleProperties, transform) {
	return IsRef$1(transform) ? {
		...Dereference(moduleProperties, transform.$ref),
		[TransformKind]: transform[TransformKind]
	} : transform;
}
function FromTuple$2(moduleProperties, types) {
	return Tuple(FromTypes(moduleProperties, types));
}
function FromUnion$2(moduleProperties, types) {
	return Union$1(FromTypes(moduleProperties, types));
}
function FromTypes(moduleProperties, types) {
	return types.map((type) => FromType(moduleProperties, type));
}
function FromType(moduleProperties, type) {
	return IsOptional$1(type) ? CreateType(FromType(moduleProperties, Discard(type, [OptionalKind])), type) : IsReadonly(type) ? CreateType(FromType(moduleProperties, Discard(type, [ReadonlyKind])), type) : IsTransform$1(type) ? CreateType(FromTransform(moduleProperties, type), type) : IsArray$1(type) ? CreateType(FromArray$2(moduleProperties, type.items), type) : IsAsyncIterator$1(type) ? CreateType(FromAsyncIterator$2(moduleProperties, type.items), type) : IsComputed$1(type) ? CreateType(FromComputed(moduleProperties, type.target, type.parameters)) : IsConstructor$1(type) ? CreateType(FromConstructor$2(moduleProperties, type.parameters, type.returns), type) : IsFunction$1(type) ? CreateType(FromFunction$2(moduleProperties, type.parameters, type.returns), type) : IsIntersect$1(type) ? CreateType(FromIntersect$2(moduleProperties, type.allOf), type) : IsIterator$1(type) ? CreateType(FromIterator$2(moduleProperties, type.items), type) : IsObject$1(type) ? CreateType(FromObject$2(moduleProperties, type.properties), type) : IsRecord$1(type) ? CreateType(FromRecord$2(moduleProperties, type)) : IsTuple$1(type) ? CreateType(FromTuple$2(moduleProperties, type.items || []), type) : IsUnion$1(type) ? CreateType(FromUnion$2(moduleProperties, type.anyOf), type) : type;
}
function ComputeType(moduleProperties, key) {
	return key in moduleProperties ? FromType(moduleProperties, moduleProperties[key]) : Never();
}
function ComputeModuleProperties(moduleProperties) {
	return globalThis.Object.getOwnPropertyNames(moduleProperties).reduce((result, key) => {
		return {
			...result,
			[key]: ComputeType(moduleProperties, key)
		};
	}, {});
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/module/module.mjs
var TModule = class {
	constructor($defs) {
		const computed = ComputeModuleProperties($defs);
		const identified = this.WithIdentifiers(computed);
		this.$defs = identified;
	}
	/** `[Json]` Imports a Type by Key. */
	Import(key, options) {
		const $defs = {
			...this.$defs,
			[key]: CreateType(this.$defs[key], options)
		};
		return CreateType({
			[Kind]: "Import",
			$defs,
			$ref: key
		});
	}
	WithIdentifiers($defs) {
		return globalThis.Object.getOwnPropertyNames($defs).reduce((result, key) => {
			return {
				...result,
				[key]: {
					...$defs[key],
					$id: key
				}
			};
		}, {});
	}
};
/** `[Json]` Creates a Type Definition Module. */
function Module(properties) {
	return new TModule(properties);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/not/not.mjs
/** `[Json]` Creates a Not type */
function Not(type, options) {
	return CreateType({
		[Kind]: "Not",
		not: type
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/parameters/parameters.mjs
/** `[JavaScript]` Extracts the Parameters from the given Function type */
function Parameters(schema, options) {
	return IsFunction$1(schema) ? Tuple(schema.parameters, options) : Never();
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/recursive/recursive.mjs
let Ordinal = 0;
/** `[Json]` Creates a Recursive type */
function Recursive(callback, options = {}) {
	if (IsUndefined$3(options.$id)) options.$id = `T${Ordinal++}`;
	const thisType = CloneType(callback({
		[Kind]: "This",
		$ref: `${options.$id}`
	}));
	thisType.$id = options.$id;
	return CreateType({
		[Hint]: "Recursive",
		...thisType
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/regexp/regexp.mjs
/** `[JavaScript]` Creates a RegExp type */
function RegExp$1(unresolved, options) {
	const expr = IsString$3(unresolved) ? new globalThis.RegExp(unresolved) : unresolved;
	return CreateType({
		[Kind]: "RegExp",
		type: "RegExp",
		source: expr.source,
		flags: expr.flags
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/rest/rest.mjs
function RestResolve(T) {
	return IsIntersect$1(T) ? T.allOf : IsUnion$1(T) ? T.anyOf : IsTuple$1(T) ? T.items ?? [] : [];
}
/** `[Json]` Extracts interior Rest elements from Tuple, Intersect and Union types */
function Rest(T) {
	return RestResolve(T);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/return-type/return-type.mjs
/** `[JavaScript]` Extracts the ReturnType from the given Function type */
function ReturnType(schema, options) {
	return IsFunction$1(schema) ? CreateType(schema.returns, options) : Never(options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/transform/transform.mjs
var TransformDecodeBuilder = class {
	constructor(schema) {
		this.schema = schema;
	}
	Decode(decode) {
		return new TransformEncodeBuilder(this.schema, decode);
	}
};
var TransformEncodeBuilder = class {
	constructor(schema, decode) {
		this.schema = schema;
		this.decode = decode;
	}
	EncodeTransform(encode, schema) {
		const Encode = (value) => schema[TransformKind].Encode(encode(value));
		const Decode = (value) => this.decode(schema[TransformKind].Decode(value));
		const Codec = {
			Encode,
			Decode
		};
		return {
			...schema,
			[TransformKind]: Codec
		};
	}
	EncodeSchema(encode, schema) {
		const Codec = {
			Decode: this.decode,
			Encode: encode
		};
		return {
			...schema,
			[TransformKind]: Codec
		};
	}
	Encode(encode) {
		return IsTransform$1(this.schema) ? this.EncodeTransform(encode, this.schema) : this.EncodeSchema(encode, this.schema);
	}
};
/** `[Json]` Creates a Transform type */
function Transform(schema) {
	return new TransformDecodeBuilder(schema);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/unsafe/unsafe.mjs
/** `[Json]` Creates a Unsafe type that will infers as the generic argument T */
function Unsafe(options = {}) {
	return CreateType({ [Kind]: options[Kind] ?? "Unsafe" }, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/void/void.mjs
/** `[JavaScript]` Creates a Void type */
function Void(options) {
	return CreateType({
		[Kind]: "Void",
		type: "void"
	}, options);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/type/type/index.mjs
/** JavaScript Type Builder with Static Resolution for TypeScript */
const Type = /* @__PURE__ */ __exportAll({
	Any: () => Any,
	Argument: () => Argument,
	Array: () => Array$1,
	AsyncIterator: () => AsyncIterator,
	Awaited: () => Awaited,
	BigInt: () => BigInt$1,
	Boolean: () => Boolean$1,
	Capitalize: () => Capitalize,
	Composite: () => Composite,
	Const: () => Const,
	Constructor: () => Constructor,
	ConstructorParameters: () => ConstructorParameters,
	Date: () => Date$1,
	Enum: () => Enum,
	Exclude: () => Exclude,
	Extends: () => Extends,
	Extract: () => Extract,
	Function: () => Function$1,
	Index: () => Index,
	InstanceType: () => InstanceType,
	Instantiate: () => Instantiate,
	Integer: () => Integer,
	Intersect: () => Intersect$1,
	Iterator: () => Iterator,
	KeyOf: () => KeyOf,
	Literal: () => Literal,
	Lowercase: () => Lowercase,
	Mapped: () => Mapped,
	Module: () => Module,
	Never: () => Never,
	Not: () => Not,
	Null: () => Null,
	Number: () => Number$1,
	Object: () => Object$1,
	Omit: () => Omit,
	Optional: () => Optional,
	Parameters: () => Parameters,
	Partial: () => Partial,
	Pick: () => Pick,
	Promise: () => Promise$1,
	Readonly: () => Readonly,
	ReadonlyOptional: () => ReadonlyOptional,
	Record: () => Record,
	Recursive: () => Recursive,
	Ref: () => Ref$1,
	RegExp: () => RegExp$1,
	Required: () => Required,
	Rest: () => Rest,
	ReturnType: () => ReturnType,
	String: () => String$1,
	Symbol: () => Symbol$1,
	TemplateLiteral: () => TemplateLiteral,
	Transform: () => Transform,
	Tuple: () => Tuple,
	Uint8Array: () => Uint8Array$1,
	Uncapitalize: () => Uncapitalize,
	Undefined: () => Undefined,
	Union: () => Union$1,
	Unknown: () => Unknown,
	Unsafe: () => Unsafe,
	Uppercase: () => Uppercase,
	Void: () => Void
});
//#endregion
//#region ../dsgraph-schema/dist/types.js
/** A selection of context per modifier, e.g. `{ theme: "dark" }`. An empty object means "all contexts". */
const When = Type.Record(Type.String(), Type.String(), { $id: "When" });
const Severity = Type.Union([
	Type.Literal("error"),
	Type.Literal("warning"),
	Type.Literal("info")
]);
const Loc = Type.Object({
	file: Type.Optional(Type.String()),
	pointer: Type.Optional(Type.String()),
	line: Type.Optional(Type.Integer()),
	column: Type.Optional(Type.Integer())
}, { $id: "Loc" });
const Diagnostic = Type.Object({
	code: Type.String(),
	severity: Severity,
	message: Type.String(),
	loc: Type.Optional(Loc)
}, { $id: "Diagnostic" });
/** A reference from one token's value to another token. */
const Ref = Type.Object({
	to: Type.String(),
	/** JSON Pointer inside the referencing token's value; absent for a whole-value alias. */
	property: Type.Optional(Type.String()),
	/** JSON Pointer inside the target token's value, for property-level `$ref`. */
	targetPath: Type.Optional(Type.String())
}, { $id: "Ref" });
const TokenValue = Type.Object({
	when: When,
	/** The value as authored after merging, references unresolved. */
	raw: Type.Unknown(),
	/** Canonical resolved value, or null when it could not be resolved. */
	value: Type.Unknown(),
	refs: Type.Array(Ref)
}, { $id: "TokenValue" });
const Deprecated = Type.Object({
	reason: Type.Optional(Type.String()),
	replacement: Type.Optional(Type.String())
}, { $id: "Deprecated" });
const TypeSource = Type.Union([
	Type.Literal("explicit"),
	Type.Literal("inherited"),
	Type.Literal("alias"),
	Type.Literal("inferred")
]);
const Origin = Type.Object({
	file: Type.String(),
	pointer: Type.String()
}, { $id: "Origin" });
const Token = Type.Object({
	id: Type.String(),
	path: Type.Array(Type.String()),
	type: Type.Union([Type.String(), Type.Null()]),
	typeSource: Type.Union([TypeSource, Type.Null()]),
	layer: Type.Union([Type.String(), Type.Null()]),
	description: Type.Optional(Type.String()),
	deprecated: Type.Union([Deprecated, Type.Null()]),
	values: Type.Array(TokenValue),
	origin: Origin,
	inheritedFrom: Type.Union([Type.String(), Type.Null()]),
	extensions: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	flags: Type.Array(Type.String())
}, { $id: "Token" });
const Group = Type.Object({
	id: Type.String(),
	path: Type.Array(Type.String()),
	type: Type.Optional(Type.String()),
	description: Type.Optional(Type.String()),
	deprecated: Type.Optional(Deprecated),
	extends: Type.Optional(Type.String()),
	extensions: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	origin: Origin
}, { $id: "Group" });
const EdgeKind = Type.Union([
	Type.Literal("aliases"),
	Type.Literal("extends"),
	Type.Literal("deprecated_by"),
	Type.Literal("uses_token"),
	Type.Literal("imports"),
	Type.Literal("renders"),
	Type.Literal("used_at"),
	Type.Literal("hardcodes")
]);
const EdgeAttrs = Type.Object({
	property: Type.Optional(Type.String()),
	targetPath: Type.Optional(Type.String()),
	when: Type.Optional(When)
}, { additionalProperties: true });
/** `[kind, from, to, attrs?]` */
const Edge = Type.Union([Type.Tuple([
	EdgeKind,
	Type.String(),
	Type.String()
]), Type.Tuple([
	EdgeKind,
	Type.String(),
	Type.String(),
	EdgeAttrs
])]);
const SourceMeta = Type.Object({
	kind: Type.String(),
	package: Type.Optional(Type.String()),
	version: Type.Optional(Type.String()),
	repo: Type.Optional(Type.String()),
	ref: Type.Optional(Type.String()),
	commit: Type.Optional(Type.String()),
	path: Type.Optional(Type.String())
}, {
	$id: "SourceMeta",
	additionalProperties: true
});
const Modifier = Type.Object({
	name: Type.String(),
	contexts: Type.Array(Type.String()),
	default: Type.Optional(Type.String())
}, { $id: "Modifier" });
const SNAPSHOT_SCHEMA = "dsgraph/snapshot@1";
const Snapshot = Type.Object({
	schema: Type.Literal(SNAPSHOT_SCHEMA),
	source: SourceMeta,
	contexts: Type.Object({
		modifiers: Type.Array(Modifier),
		permutations: Type.Integer(),
		partial: Type.Boolean()
	}),
	nodes: Type.Object({
		groups: Type.Array(Group),
		tokens: Type.Array(Token)
	}),
	edges: Type.Array(Edge),
	diagnostics: Type.Array(Diagnostic),
	hash: Type.String(),
	meta: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
}, { $id: "Snapshot" });
const ChangeKind = Type.Union([
	Type.Literal("token.added"),
	Type.Literal("token.removed"),
	Type.Literal("token.renamed"),
	Type.Literal("token.value-changed"),
	Type.Literal("token.notation-changed"),
	Type.Literal("token.alias-retargeted"),
	Type.Literal("token.type-changed"),
	Type.Literal("token.contexts-changed"),
	Type.Literal("token.missing-in-context"),
	Type.Literal("token.deprecated"),
	Type.Literal("token.undeprecated"),
	Type.Literal("token.description-changed"),
	Type.Literal("token.extensions-changed"),
	Type.Literal("group.extends-changed"),
	Type.Literal("context.added"),
	Type.Literal("context.removed"),
	Type.Literal("modifier.added"),
	Type.Literal("modifier.removed")
]);
const Level = Type.Union([
	Type.Literal("major"),
	Type.Literal("minor"),
	Type.Literal("patch"),
	Type.Literal("none")
]);
const Change = Type.Object({
	id: Type.String(),
	kind: ChangeKind,
	target: Type.String(),
	from: Type.Optional(Type.String()),
	when: Type.Union([When, Type.Null()]),
	before: Type.Optional(Type.Unknown()),
	after: Type.Optional(Type.Unknown()),
	delta: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	origin: Type.Union([Type.Literal("direct"), Type.Literal("propagated")]),
	cause: Type.Array(Type.String()),
	level: Level,
	confidence: Type.Number(),
	possibleRenames: Type.Optional(Type.Array(Type.String())),
	note: Type.Optional(Type.String())
}, { $id: "Change" });
const CHANGESET_SCHEMA = "dsgraph/changeset@1";
Type.Object({
	schema: Type.Literal(CHANGESET_SCHEMA),
	base: Type.Object({
		hash: Type.String(),
		source: SourceMeta
	}),
	head: Type.Object({
		hash: Type.String(),
		source: SourceMeta
	}),
	contexts: Type.Object({
		compared: Type.Array(When),
		partial: Type.Boolean()
	}),
	summary: Type.Object({
		counts: Type.Record(Type.String(), Type.Integer()),
		level: Level,
		reasons: Type.Array(Type.String())
	}),
	changes: Type.Array(Change),
	diagnostics: Type.Array(Diagnostic)
}, { $id: "Changeset" });
Type.Object({
	id: Type.String(),
	rule: Type.String(),
	severity: Severity,
	message: Type.String(),
	/** Ids of the nodes involved (tokens, groups). */
	nodes: Type.Array(Type.String()),
	/** What makes this a finding: values, paths in the graph. */
	evidence: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	when: Type.Optional(When),
	loc: Type.Optional(Loc)
}, { $id: "Finding" });
const RuleSetting = Type.Union([
	Type.Literal("off"),
	Severity,
	Type.Tuple([Type.Union([Type.Literal("off"), Severity]), Type.Record(Type.String(), Type.Unknown())])
]);
/** `dsgraph.config.json` (spec section 7.3). Every section is optional; auto-detection fills the rest. */
const Config = Type.Object({
	$schema: Type.Optional(Type.String()),
	extends: Type.Optional(Type.Array(Type.String())),
	tokens: Type.Optional(Type.Object({
		include: Type.Optional(Type.Array(Type.String())),
		exclude: Type.Optional(Type.Array(Type.String())),
		resolver: Type.Optional(Type.String()),
		order: Type.Optional(Type.Array(Type.String())),
		strict: Type.Optional(Type.Boolean())
	})),
	css: Type.Optional(Type.Object({
		include: Type.Optional(Type.Array(Type.String())),
		exclude: Type.Optional(Type.Array(Type.String())),
		prefix: Type.Optional(Type.String()),
		/** modifier → context → selectors (`:root`, `[data-theme=dark]`, `@media (prefers-color-scheme: dark)`). */
		contexts: Type.Optional(Type.Record(Type.String(), Type.Record(Type.String(), Type.Array(Type.String())))),
		remBase: Type.Optional(Type.Number())
	})),
	layers: Type.Optional(Type.Record(Type.String(), Type.Object({
		match: Type.Array(Type.String()),
		public: Type.Optional(Type.Boolean())
	}))),
	contexts: Type.Optional(Type.Object({
		default: Type.Optional(Type.Record(Type.String(), Type.String())),
		maxPermutations: Type.Optional(Type.Integer())
	})),
	compare: Type.Optional(Type.Object({
		equalDeltaE: Type.Optional(Type.Number()),
		ignoreExtensions: Type.Optional(Type.Array(Type.String()))
	})),
	renames: Type.Optional(Type.Record(Type.String(), Type.String())),
	semver: Type.Optional(Type.Object({
		levels: Type.Optional(Type.Record(Type.String(), Level)),
		imperceptible: Type.Optional(Type.Object({
			deltaE: Type.Optional(Type.Number()),
			px: Type.Optional(Type.Number())
		}))
	})),
	rules: Type.Optional(Type.Record(Type.String(), RuleSetting))
}, { $id: "Config" });
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/errors/function.mjs
/** Creates an error message using en-US as the default locale */
function DefaultErrorFunction(error) {
	switch (error.errorType) {
		case ValueErrorType.ArrayContains: return "Expected array to contain at least one matching value";
		case ValueErrorType.ArrayMaxContains: return `Expected array to contain no more than ${error.schema.maxContains} matching values`;
		case ValueErrorType.ArrayMinContains: return `Expected array to contain at least ${error.schema.minContains} matching values`;
		case ValueErrorType.ArrayMaxItems: return `Expected array length to be less or equal to ${error.schema.maxItems}`;
		case ValueErrorType.ArrayMinItems: return `Expected array length to be greater or equal to ${error.schema.minItems}`;
		case ValueErrorType.ArrayUniqueItems: return "Expected array elements to be unique";
		case ValueErrorType.Array: return "Expected array";
		case ValueErrorType.AsyncIterator: return "Expected AsyncIterator";
		case ValueErrorType.BigIntExclusiveMaximum: return `Expected bigint to be less than ${error.schema.exclusiveMaximum}`;
		case ValueErrorType.BigIntExclusiveMinimum: return `Expected bigint to be greater than ${error.schema.exclusiveMinimum}`;
		case ValueErrorType.BigIntMaximum: return `Expected bigint to be less or equal to ${error.schema.maximum}`;
		case ValueErrorType.BigIntMinimum: return `Expected bigint to be greater or equal to ${error.schema.minimum}`;
		case ValueErrorType.BigIntMultipleOf: return `Expected bigint to be a multiple of ${error.schema.multipleOf}`;
		case ValueErrorType.BigInt: return "Expected bigint";
		case ValueErrorType.Boolean: return "Expected boolean";
		case ValueErrorType.DateExclusiveMinimumTimestamp: return `Expected Date timestamp to be greater than ${error.schema.exclusiveMinimumTimestamp}`;
		case ValueErrorType.DateExclusiveMaximumTimestamp: return `Expected Date timestamp to be less than ${error.schema.exclusiveMaximumTimestamp}`;
		case ValueErrorType.DateMinimumTimestamp: return `Expected Date timestamp to be greater or equal to ${error.schema.minimumTimestamp}`;
		case ValueErrorType.DateMaximumTimestamp: return `Expected Date timestamp to be less or equal to ${error.schema.maximumTimestamp}`;
		case ValueErrorType.DateMultipleOfTimestamp: return `Expected Date timestamp to be a multiple of ${error.schema.multipleOfTimestamp}`;
		case ValueErrorType.Date: return "Expected Date";
		case ValueErrorType.Function: return "Expected function";
		case ValueErrorType.IntegerExclusiveMaximum: return `Expected integer to be less than ${error.schema.exclusiveMaximum}`;
		case ValueErrorType.IntegerExclusiveMinimum: return `Expected integer to be greater than ${error.schema.exclusiveMinimum}`;
		case ValueErrorType.IntegerMaximum: return `Expected integer to be less or equal to ${error.schema.maximum}`;
		case ValueErrorType.IntegerMinimum: return `Expected integer to be greater or equal to ${error.schema.minimum}`;
		case ValueErrorType.IntegerMultipleOf: return `Expected integer to be a multiple of ${error.schema.multipleOf}`;
		case ValueErrorType.Integer: return "Expected integer";
		case ValueErrorType.IntersectUnevaluatedProperties: return "Unexpected property";
		case ValueErrorType.Intersect: return "Expected all values to match";
		case ValueErrorType.Iterator: return "Expected Iterator";
		case ValueErrorType.Literal: return `Expected ${typeof error.schema.const === "string" ? `'${error.schema.const}'` : error.schema.const}`;
		case ValueErrorType.Never: return "Never";
		case ValueErrorType.Not: return "Value should not match";
		case ValueErrorType.Null: return "Expected null";
		case ValueErrorType.NumberExclusiveMaximum: return `Expected number to be less than ${error.schema.exclusiveMaximum}`;
		case ValueErrorType.NumberExclusiveMinimum: return `Expected number to be greater than ${error.schema.exclusiveMinimum}`;
		case ValueErrorType.NumberMaximum: return `Expected number to be less or equal to ${error.schema.maximum}`;
		case ValueErrorType.NumberMinimum: return `Expected number to be greater or equal to ${error.schema.minimum}`;
		case ValueErrorType.NumberMultipleOf: return `Expected number to be a multiple of ${error.schema.multipleOf}`;
		case ValueErrorType.Number: return "Expected number";
		case ValueErrorType.Object: return "Expected object";
		case ValueErrorType.ObjectAdditionalProperties: return "Unexpected property";
		case ValueErrorType.ObjectMaxProperties: return `Expected object to have no more than ${error.schema.maxProperties} properties`;
		case ValueErrorType.ObjectMinProperties: return `Expected object to have at least ${error.schema.minProperties} properties`;
		case ValueErrorType.ObjectRequiredProperty: return "Expected required property";
		case ValueErrorType.Promise: return "Expected Promise";
		case ValueErrorType.RegExp: return "Expected string to match regular expression";
		case ValueErrorType.StringFormatUnknown: return `Unknown format '${error.schema.format}'`;
		case ValueErrorType.StringFormat: return `Expected string to match '${error.schema.format}' format`;
		case ValueErrorType.StringMaxLength: return `Expected string length less or equal to ${error.schema.maxLength}`;
		case ValueErrorType.StringMinLength: return `Expected string length greater or equal to ${error.schema.minLength}`;
		case ValueErrorType.StringPattern: return `Expected string to match '${error.schema.pattern}'`;
		case ValueErrorType.String: return "Expected string";
		case ValueErrorType.Symbol: return "Expected symbol";
		case ValueErrorType.TupleLength: return `Expected tuple to have ${error.schema.maxItems || 0} elements`;
		case ValueErrorType.Tuple: return "Expected tuple";
		case ValueErrorType.Uint8ArrayMaxByteLength: return `Expected byte length less or equal to ${error.schema.maxByteLength}`;
		case ValueErrorType.Uint8ArrayMinByteLength: return `Expected byte length greater or equal to ${error.schema.minByteLength}`;
		case ValueErrorType.Uint8Array: return "Expected Uint8Array";
		case ValueErrorType.Undefined: return "Expected undefined";
		case ValueErrorType.Union: return "Expected union value";
		case ValueErrorType.Void: return "Expected void";
		case ValueErrorType.Kind: return `Expected kind '${error.schema[Kind]}'`;
		default: return "Unknown error type";
	}
}
/** Manages error message providers */
let errorFunction = DefaultErrorFunction;
/** Gets the error function used to generate error messages */
function GetErrorFunction() {
	return errorFunction;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/value/deref/deref.mjs
var TypeDereferenceError = class extends TypeBoxError {
	constructor(schema) {
		super(`Unable to dereference schema with $id '${schema.$ref}'`);
		this.schema = schema;
	}
};
function Resolve(schema, references) {
	const target = references.find((target) => target.$id === schema.$ref);
	if (target === void 0) throw new TypeDereferenceError(schema);
	return Deref(target, references);
}
/** `[Internal]` Pushes a schema onto references if the schema has an $id and does not exist on references */
function Pushref(schema, references) {
	if (!IsString$2(schema.$id) || references.some((target) => target.$id === schema.$id)) return references;
	references.push(schema);
	return references;
}
/** `[Internal]` Dereferences a schema from the references array or throws if not found */
function Deref(schema, references) {
	return schema[Kind] === "This" || schema[Kind] === "Ref" ? Resolve(schema, references) : schema;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/value/hash/hash.mjs
var ValueHashError = class extends TypeBoxError {
	constructor(value) {
		super(`Unable to hash value`);
		this.value = value;
	}
};
var ByteMarker;
(function(ByteMarker) {
	ByteMarker[ByteMarker["Undefined"] = 0] = "Undefined";
	ByteMarker[ByteMarker["Null"] = 1] = "Null";
	ByteMarker[ByteMarker["Boolean"] = 2] = "Boolean";
	ByteMarker[ByteMarker["Number"] = 3] = "Number";
	ByteMarker[ByteMarker["String"] = 4] = "String";
	ByteMarker[ByteMarker["Object"] = 5] = "Object";
	ByteMarker[ByteMarker["Array"] = 6] = "Array";
	ByteMarker[ByteMarker["Date"] = 7] = "Date";
	ByteMarker[ByteMarker["Uint8Array"] = 8] = "Uint8Array";
	ByteMarker[ByteMarker["Symbol"] = 9] = "Symbol";
	ByteMarker[ByteMarker["BigInt"] = 10] = "BigInt";
})(ByteMarker || (ByteMarker = {}));
let Accumulator = BigInt("14695981039346656037");
const [Prime, Size] = [BigInt("1099511628211"), BigInt("18446744073709551616")];
const Bytes = Array.from({ length: 256 }).map((_, i) => BigInt(i));
const F64 = /* @__PURE__ */ new Float64Array(1);
const F64In = new DataView(F64.buffer);
const F64Out = new Uint8Array(F64.buffer);
function* NumberToBytes(value) {
	const byteCount = value === 0 ? 1 : Math.ceil(Math.floor(Math.log2(value) + 1) / 8);
	for (let i = 0; i < byteCount; i++) yield value >> 8 * (byteCount - 1 - i) & 255;
}
function ArrayType(value) {
	FNV1A64(ByteMarker.Array);
	for (const item of value) Visit$2(item);
}
function BooleanType(value) {
	FNV1A64(ByteMarker.Boolean);
	FNV1A64(value ? 1 : 0);
}
function BigIntType(value) {
	FNV1A64(ByteMarker.BigInt);
	F64In.setBigInt64(0, value);
	for (const byte of F64Out) FNV1A64(byte);
}
function DateType(value) {
	FNV1A64(ByteMarker.Date);
	Visit$2(value.getTime());
}
function NullType(value) {
	FNV1A64(ByteMarker.Null);
}
function NumberType(value) {
	FNV1A64(ByteMarker.Number);
	F64In.setFloat64(0, value);
	for (const byte of F64Out) FNV1A64(byte);
}
function ObjectType(value) {
	FNV1A64(ByteMarker.Object);
	for (const key of globalThis.Object.getOwnPropertyNames(value).sort()) {
		Visit$2(key);
		Visit$2(value[key]);
	}
}
function StringType(value) {
	FNV1A64(ByteMarker.String);
	for (let i = 0; i < value.length; i++) for (const byte of NumberToBytes(value.charCodeAt(i))) FNV1A64(byte);
}
function SymbolType(value) {
	FNV1A64(ByteMarker.Symbol);
	Visit$2(value.description);
}
function Uint8ArrayType(value) {
	FNV1A64(ByteMarker.Uint8Array);
	for (let i = 0; i < value.length; i++) FNV1A64(value[i]);
}
function UndefinedType(value) {
	return FNV1A64(ByteMarker.Undefined);
}
function Visit$2(value) {
	if (IsArray$2(value)) return ArrayType(value);
	if (IsBoolean$2(value)) return BooleanType(value);
	if (IsBigInt$2(value)) return BigIntType(value);
	if (IsDate$2(value)) return DateType(value);
	if (IsNull$2(value)) return NullType(value);
	if (IsNumber$2(value)) return NumberType(value);
	if (IsObject$2(value)) return ObjectType(value);
	if (IsString$2(value)) return StringType(value);
	if (IsSymbol$2(value)) return SymbolType(value);
	if (IsUint8Array$2(value)) return Uint8ArrayType(value);
	if (IsUndefined$2(value)) return UndefinedType(value);
	throw new ValueHashError(value);
}
function FNV1A64(byte) {
	Accumulator = Accumulator ^ Bytes[byte];
	Accumulator = Accumulator * Prime % Size;
}
/** Creates a FNV1A-64 non cryptographic hash of the given value */
function Hash(value) {
	Accumulator = BigInt("14695981039346656037");
	Visit$2(value);
	return Accumulator;
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/value/check/check.mjs
var ValueCheckUnknownTypeError = class extends TypeBoxError {
	constructor(schema) {
		super(`Unknown type`);
		this.schema = schema;
	}
};
function IsAnyOrUnknown(schema) {
	return schema[Kind] === "Any" || schema[Kind] === "Unknown";
}
function IsDefined$1(value) {
	return value !== void 0;
}
function FromAny$1(schema, references, value) {
	return true;
}
function FromArgument$1(schema, references, value) {
	return true;
}
function FromArray$1(schema, references, value) {
	if (!IsArray$2(value)) return false;
	if (IsDefined$1(schema.minItems) && !(value.length >= schema.minItems)) return false;
	if (IsDefined$1(schema.maxItems) && !(value.length <= schema.maxItems)) return false;
	for (const element of value) if (!Visit$1(schema.items, references, element)) return false;
	if (schema.uniqueItems === true && !(function() {
		const set = /* @__PURE__ */ new Set();
		for (const element of value) {
			const hashed = Hash(element);
			if (set.has(hashed)) return false;
			else set.add(hashed);
		}
		return true;
	})()) return false;
	if (!(IsDefined$1(schema.contains) || IsNumber$2(schema.minContains) || IsNumber$2(schema.maxContains))) return true;
	const containsSchema = IsDefined$1(schema.contains) ? schema.contains : Never();
	const containsCount = value.reduce((acc, value) => Visit$1(containsSchema, references, value) ? acc + 1 : acc, 0);
	if (containsCount === 0) return false;
	if (IsNumber$2(schema.minContains) && containsCount < schema.minContains) return false;
	if (IsNumber$2(schema.maxContains) && containsCount > schema.maxContains) return false;
	return true;
}
function FromAsyncIterator$1(schema, references, value) {
	return IsAsyncIterator$2(value);
}
function FromBigInt$1(schema, references, value) {
	if (!IsBigInt$2(value)) return false;
	if (IsDefined$1(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) return false;
	if (IsDefined$1(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) return false;
	if (IsDefined$1(schema.maximum) && !(value <= schema.maximum)) return false;
	if (IsDefined$1(schema.minimum) && !(value >= schema.minimum)) return false;
	if (IsDefined$1(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) return false;
	return true;
}
function FromBoolean$1(schema, references, value) {
	return IsBoolean$2(value);
}
function FromConstructor$1(schema, references, value) {
	return Visit$1(schema.returns, references, value.prototype);
}
function FromDate$1(schema, references, value) {
	if (!IsDate$2(value)) return false;
	if (IsDefined$1(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) return false;
	if (IsDefined$1(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) return false;
	if (IsDefined$1(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) return false;
	if (IsDefined$1(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) return false;
	if (IsDefined$1(schema.multipleOfTimestamp) && !(value.getTime() % schema.multipleOfTimestamp === 0)) return false;
	return true;
}
function FromFunction$1(schema, references, value) {
	return IsFunction$2(value);
}
function FromImport$1(schema, references, value) {
	const definitions = globalThis.Object.values(schema.$defs);
	const target = schema.$defs[schema.$ref];
	return Visit$1(target, [...references, ...definitions], value);
}
function FromInteger$1(schema, references, value) {
	if (!IsInteger$2(value)) return false;
	if (IsDefined$1(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) return false;
	if (IsDefined$1(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) return false;
	if (IsDefined$1(schema.maximum) && !(value <= schema.maximum)) return false;
	if (IsDefined$1(schema.minimum) && !(value >= schema.minimum)) return false;
	if (IsDefined$1(schema.multipleOf) && !(value % schema.multipleOf === 0)) return false;
	return true;
}
function FromIntersect$1(schema, references, value) {
	const check1 = schema.allOf.every((schema) => Visit$1(schema, references, value));
	if (schema.unevaluatedProperties === false) {
		const keyPattern = new RegExp(KeyOfPattern(schema));
		const check2 = Object.getOwnPropertyNames(value).every((key) => keyPattern.test(key));
		return check1 && check2;
	} else if (IsSchema$1(schema.unevaluatedProperties)) {
		const keyCheck = new RegExp(KeyOfPattern(schema));
		const check2 = Object.getOwnPropertyNames(value).every((key) => keyCheck.test(key) || Visit$1(schema.unevaluatedProperties, references, value[key]));
		return check1 && check2;
	} else return check1;
}
function FromIterator$1(schema, references, value) {
	return IsIterator$2(value);
}
function FromLiteral$1(schema, references, value) {
	return value === schema.const;
}
function FromNever$1(schema, references, value) {
	return false;
}
function FromNot$1(schema, references, value) {
	return !Visit$1(schema.not, references, value);
}
function FromNull$1(schema, references, value) {
	return IsNull$2(value);
}
function FromNumber$1(schema, references, value) {
	if (!TypeSystemPolicy.IsNumberLike(value)) return false;
	if (IsDefined$1(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) return false;
	if (IsDefined$1(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) return false;
	if (IsDefined$1(schema.minimum) && !(value >= schema.minimum)) return false;
	if (IsDefined$1(schema.maximum) && !(value <= schema.maximum)) return false;
	if (IsDefined$1(schema.multipleOf) && !(value % schema.multipleOf === 0)) return false;
	return true;
}
function FromObject$1(schema, references, value) {
	if (!TypeSystemPolicy.IsObjectLike(value)) return false;
	if (IsDefined$1(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) return false;
	if (IsDefined$1(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) return false;
	const knownKeys = Object.getOwnPropertyNames(schema.properties);
	for (const knownKey of knownKeys) {
		const property = schema.properties[knownKey];
		if (schema.required && schema.required.includes(knownKey)) {
			if (!Visit$1(property, references, value[knownKey])) return false;
			if ((ExtendsUndefinedCheck(property) || IsAnyOrUnknown(property)) && !(knownKey in value)) return false;
		} else if (TypeSystemPolicy.IsExactOptionalProperty(value, knownKey) && !Visit$1(property, references, value[knownKey])) return false;
	}
	if (schema.additionalProperties === false) {
		const valueKeys = Object.getOwnPropertyNames(value);
		if (schema.required && schema.required.length === knownKeys.length && valueKeys.length === knownKeys.length) return true;
		else return valueKeys.every((valueKey) => knownKeys.includes(valueKey));
	} else if (typeof schema.additionalProperties === "object") return Object.getOwnPropertyNames(value).every((key) => knownKeys.includes(key) || Visit$1(schema.additionalProperties, references, value[key]));
	else return true;
}
function FromPromise$1(schema, references, value) {
	return IsPromise$2(value);
}
function FromRecord$1(schema, references, value) {
	if (!TypeSystemPolicy.IsRecordLike(value)) return false;
	if (IsDefined$1(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) return false;
	if (IsDefined$1(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) return false;
	const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0];
	const regex = new RegExp(patternKey);
	const check1 = Object.entries(value).every(([key, value]) => {
		return regex.test(key) ? Visit$1(patternSchema, references, value) : true;
	});
	const check2 = typeof schema.additionalProperties === "object" ? Object.entries(value).every(([key, value]) => {
		return !regex.test(key) ? Visit$1(schema.additionalProperties, references, value) : true;
	}) : true;
	const check3 = schema.additionalProperties === false ? Object.getOwnPropertyNames(value).every((key) => {
		return regex.test(key);
	}) : true;
	return check1 && check2 && check3;
}
function FromRef$1(schema, references, value) {
	return Visit$1(Deref(schema, references), references, value);
}
function FromRegExp$1(schema, references, value) {
	const regex = new RegExp(schema.source, schema.flags);
	if (IsDefined$1(schema.minLength)) {
		if (!(value.length >= schema.minLength)) return false;
	}
	if (IsDefined$1(schema.maxLength)) {
		if (!(value.length <= schema.maxLength)) return false;
	}
	return regex.test(value);
}
function FromString$1(schema, references, value) {
	if (!IsString$2(value)) return false;
	if (IsDefined$1(schema.minLength)) {
		if (!(value.length >= schema.minLength)) return false;
	}
	if (IsDefined$1(schema.maxLength)) {
		if (!(value.length <= schema.maxLength)) return false;
	}
	if (IsDefined$1(schema.pattern)) {
		if (!new RegExp(schema.pattern).test(value)) return false;
	}
	if (IsDefined$1(schema.format)) {
		if (!Has$1(schema.format)) return false;
		return Get$1(schema.format)(value);
	}
	return true;
}
function FromSymbol$1(schema, references, value) {
	return IsSymbol$2(value);
}
function FromTemplateLiteral$1(schema, references, value) {
	return IsString$2(value) && new RegExp(schema.pattern).test(value);
}
function FromThis$1(schema, references, value) {
	return Visit$1(Deref(schema, references), references, value);
}
function FromTuple$1(schema, references, value) {
	if (!IsArray$2(value)) return false;
	if (schema.items === void 0 && !(value.length === 0)) return false;
	if (!(value.length === schema.maxItems)) return false;
	if (!schema.items) return true;
	for (let i = 0; i < schema.items.length; i++) if (!Visit$1(schema.items[i], references, value[i])) return false;
	return true;
}
function FromUndefined$1(schema, references, value) {
	return IsUndefined$2(value);
}
function FromUnion$1(schema, references, value) {
	return schema.anyOf.some((inner) => Visit$1(inner, references, value));
}
function FromUint8Array$1(schema, references, value) {
	if (!IsUint8Array$2(value)) return false;
	if (IsDefined$1(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) return false;
	if (IsDefined$1(schema.minByteLength) && !(value.length >= schema.minByteLength)) return false;
	return true;
}
function FromUnknown$1(schema, references, value) {
	return true;
}
function FromVoid$1(schema, references, value) {
	return TypeSystemPolicy.IsVoidLike(value);
}
function FromKind$1(schema, references, value) {
	if (!Has(schema[Kind])) return false;
	return Get(schema[Kind])(schema, value);
}
function Visit$1(schema, references, value) {
	const references_ = IsDefined$1(schema.$id) ? Pushref(schema, references) : references;
	const schema_ = schema;
	switch (schema_[Kind]) {
		case "Any": return FromAny$1(schema_, references_, value);
		case "Argument": return FromArgument$1(schema_, references_, value);
		case "Array": return FromArray$1(schema_, references_, value);
		case "AsyncIterator": return FromAsyncIterator$1(schema_, references_, value);
		case "BigInt": return FromBigInt$1(schema_, references_, value);
		case "Boolean": return FromBoolean$1(schema_, references_, value);
		case "Constructor": return FromConstructor$1(schema_, references_, value);
		case "Date": return FromDate$1(schema_, references_, value);
		case "Function": return FromFunction$1(schema_, references_, value);
		case "Import": return FromImport$1(schema_, references_, value);
		case "Integer": return FromInteger$1(schema_, references_, value);
		case "Intersect": return FromIntersect$1(schema_, references_, value);
		case "Iterator": return FromIterator$1(schema_, references_, value);
		case "Literal": return FromLiteral$1(schema_, references_, value);
		case "Never": return FromNever$1(schema_, references_, value);
		case "Not": return FromNot$1(schema_, references_, value);
		case "Null": return FromNull$1(schema_, references_, value);
		case "Number": return FromNumber$1(schema_, references_, value);
		case "Object": return FromObject$1(schema_, references_, value);
		case "Promise": return FromPromise$1(schema_, references_, value);
		case "Record": return FromRecord$1(schema_, references_, value);
		case "Ref": return FromRef$1(schema_, references_, value);
		case "RegExp": return FromRegExp$1(schema_, references_, value);
		case "String": return FromString$1(schema_, references_, value);
		case "Symbol": return FromSymbol$1(schema_, references_, value);
		case "TemplateLiteral": return FromTemplateLiteral$1(schema_, references_, value);
		case "This": return FromThis$1(schema_, references_, value);
		case "Tuple": return FromTuple$1(schema_, references_, value);
		case "Undefined": return FromUndefined$1(schema_, references_, value);
		case "Union": return FromUnion$1(schema_, references_, value);
		case "Uint8Array": return FromUint8Array$1(schema_, references_, value);
		case "Unknown": return FromUnknown$1(schema_, references_, value);
		case "Void": return FromVoid$1(schema_, references_, value);
		default:
			if (!Has(schema_[Kind])) throw new ValueCheckUnknownTypeError(schema_);
			return FromKind$1(schema_, references_, value);
	}
}
/** Returns true if the value matches the given type. */
function Check(...args) {
	return args.length === 3 ? Visit$1(args[0], args[1], args[2]) : Visit$1(args[0], [], args[1]);
}
//#endregion
//#region ../../node_modules/@sinclair/typebox/build/esm/errors/errors.mjs
var ValueErrorType;
(function(ValueErrorType) {
	ValueErrorType[ValueErrorType["ArrayContains"] = 0] = "ArrayContains";
	ValueErrorType[ValueErrorType["ArrayMaxContains"] = 1] = "ArrayMaxContains";
	ValueErrorType[ValueErrorType["ArrayMaxItems"] = 2] = "ArrayMaxItems";
	ValueErrorType[ValueErrorType["ArrayMinContains"] = 3] = "ArrayMinContains";
	ValueErrorType[ValueErrorType["ArrayMinItems"] = 4] = "ArrayMinItems";
	ValueErrorType[ValueErrorType["ArrayUniqueItems"] = 5] = "ArrayUniqueItems";
	ValueErrorType[ValueErrorType["Array"] = 6] = "Array";
	ValueErrorType[ValueErrorType["AsyncIterator"] = 7] = "AsyncIterator";
	ValueErrorType[ValueErrorType["BigIntExclusiveMaximum"] = 8] = "BigIntExclusiveMaximum";
	ValueErrorType[ValueErrorType["BigIntExclusiveMinimum"] = 9] = "BigIntExclusiveMinimum";
	ValueErrorType[ValueErrorType["BigIntMaximum"] = 10] = "BigIntMaximum";
	ValueErrorType[ValueErrorType["BigIntMinimum"] = 11] = "BigIntMinimum";
	ValueErrorType[ValueErrorType["BigIntMultipleOf"] = 12] = "BigIntMultipleOf";
	ValueErrorType[ValueErrorType["BigInt"] = 13] = "BigInt";
	ValueErrorType[ValueErrorType["Boolean"] = 14] = "Boolean";
	ValueErrorType[ValueErrorType["DateExclusiveMaximumTimestamp"] = 15] = "DateExclusiveMaximumTimestamp";
	ValueErrorType[ValueErrorType["DateExclusiveMinimumTimestamp"] = 16] = "DateExclusiveMinimumTimestamp";
	ValueErrorType[ValueErrorType["DateMaximumTimestamp"] = 17] = "DateMaximumTimestamp";
	ValueErrorType[ValueErrorType["DateMinimumTimestamp"] = 18] = "DateMinimumTimestamp";
	ValueErrorType[ValueErrorType["DateMultipleOfTimestamp"] = 19] = "DateMultipleOfTimestamp";
	ValueErrorType[ValueErrorType["Date"] = 20] = "Date";
	ValueErrorType[ValueErrorType["Function"] = 21] = "Function";
	ValueErrorType[ValueErrorType["IntegerExclusiveMaximum"] = 22] = "IntegerExclusiveMaximum";
	ValueErrorType[ValueErrorType["IntegerExclusiveMinimum"] = 23] = "IntegerExclusiveMinimum";
	ValueErrorType[ValueErrorType["IntegerMaximum"] = 24] = "IntegerMaximum";
	ValueErrorType[ValueErrorType["IntegerMinimum"] = 25] = "IntegerMinimum";
	ValueErrorType[ValueErrorType["IntegerMultipleOf"] = 26] = "IntegerMultipleOf";
	ValueErrorType[ValueErrorType["Integer"] = 27] = "Integer";
	ValueErrorType[ValueErrorType["IntersectUnevaluatedProperties"] = 28] = "IntersectUnevaluatedProperties";
	ValueErrorType[ValueErrorType["Intersect"] = 29] = "Intersect";
	ValueErrorType[ValueErrorType["Iterator"] = 30] = "Iterator";
	ValueErrorType[ValueErrorType["Kind"] = 31] = "Kind";
	ValueErrorType[ValueErrorType["Literal"] = 32] = "Literal";
	ValueErrorType[ValueErrorType["Never"] = 33] = "Never";
	ValueErrorType[ValueErrorType["Not"] = 34] = "Not";
	ValueErrorType[ValueErrorType["Null"] = 35] = "Null";
	ValueErrorType[ValueErrorType["NumberExclusiveMaximum"] = 36] = "NumberExclusiveMaximum";
	ValueErrorType[ValueErrorType["NumberExclusiveMinimum"] = 37] = "NumberExclusiveMinimum";
	ValueErrorType[ValueErrorType["NumberMaximum"] = 38] = "NumberMaximum";
	ValueErrorType[ValueErrorType["NumberMinimum"] = 39] = "NumberMinimum";
	ValueErrorType[ValueErrorType["NumberMultipleOf"] = 40] = "NumberMultipleOf";
	ValueErrorType[ValueErrorType["Number"] = 41] = "Number";
	ValueErrorType[ValueErrorType["ObjectAdditionalProperties"] = 42] = "ObjectAdditionalProperties";
	ValueErrorType[ValueErrorType["ObjectMaxProperties"] = 43] = "ObjectMaxProperties";
	ValueErrorType[ValueErrorType["ObjectMinProperties"] = 44] = "ObjectMinProperties";
	ValueErrorType[ValueErrorType["ObjectRequiredProperty"] = 45] = "ObjectRequiredProperty";
	ValueErrorType[ValueErrorType["Object"] = 46] = "Object";
	ValueErrorType[ValueErrorType["Promise"] = 47] = "Promise";
	ValueErrorType[ValueErrorType["RegExp"] = 48] = "RegExp";
	ValueErrorType[ValueErrorType["StringFormatUnknown"] = 49] = "StringFormatUnknown";
	ValueErrorType[ValueErrorType["StringFormat"] = 50] = "StringFormat";
	ValueErrorType[ValueErrorType["StringMaxLength"] = 51] = "StringMaxLength";
	ValueErrorType[ValueErrorType["StringMinLength"] = 52] = "StringMinLength";
	ValueErrorType[ValueErrorType["StringPattern"] = 53] = "StringPattern";
	ValueErrorType[ValueErrorType["String"] = 54] = "String";
	ValueErrorType[ValueErrorType["Symbol"] = 55] = "Symbol";
	ValueErrorType[ValueErrorType["TupleLength"] = 56] = "TupleLength";
	ValueErrorType[ValueErrorType["Tuple"] = 57] = "Tuple";
	ValueErrorType[ValueErrorType["Uint8ArrayMaxByteLength"] = 58] = "Uint8ArrayMaxByteLength";
	ValueErrorType[ValueErrorType["Uint8ArrayMinByteLength"] = 59] = "Uint8ArrayMinByteLength";
	ValueErrorType[ValueErrorType["Uint8Array"] = 60] = "Uint8Array";
	ValueErrorType[ValueErrorType["Undefined"] = 61] = "Undefined";
	ValueErrorType[ValueErrorType["Union"] = 62] = "Union";
	ValueErrorType[ValueErrorType["Void"] = 63] = "Void";
})(ValueErrorType || (ValueErrorType = {}));
var ValueErrorsUnknownTypeError = class extends TypeBoxError {
	constructor(schema) {
		super("Unknown type");
		this.schema = schema;
	}
};
function EscapeKey(key) {
	return key.replace(/~/g, "~0").replace(/\//g, "~1");
}
function IsDefined(value) {
	return value !== void 0;
}
var ValueErrorIterator = class {
	constructor(iterator) {
		this.iterator = iterator;
	}
	[Symbol.iterator]() {
		return this.iterator;
	}
	/** Returns the first value error or undefined if no errors */
	First() {
		const next = this.iterator.next();
		return next.done ? void 0 : next.value;
	}
};
function Create(errorType, schema, path, value, errors = []) {
	return {
		type: errorType,
		schema,
		path,
		value,
		message: GetErrorFunction()({
			errorType,
			path,
			schema,
			value,
			errors
		}),
		errors
	};
}
function* FromAny(schema, references, path, value) {}
function* FromArgument(schema, references, path, value) {}
function* FromArray(schema, references, path, value) {
	if (!IsArray$2(value)) return yield Create(ValueErrorType.Array, schema, path, value);
	if (IsDefined(schema.minItems) && !(value.length >= schema.minItems)) yield Create(ValueErrorType.ArrayMinItems, schema, path, value);
	if (IsDefined(schema.maxItems) && !(value.length <= schema.maxItems)) yield Create(ValueErrorType.ArrayMaxItems, schema, path, value);
	for (let i = 0; i < value.length; i++) yield* Visit(schema.items, references, `${path}/${i}`, value[i]);
	if (schema.uniqueItems === true && !(function() {
		const set = /* @__PURE__ */ new Set();
		for (const element of value) {
			const hashed = Hash(element);
			if (set.has(hashed)) return false;
			else set.add(hashed);
		}
		return true;
	})()) yield Create(ValueErrorType.ArrayUniqueItems, schema, path, value);
	if (!(IsDefined(schema.contains) || IsDefined(schema.minContains) || IsDefined(schema.maxContains))) return;
	const containsSchema = IsDefined(schema.contains) ? schema.contains : Never();
	const containsCount = value.reduce((acc, value, index) => Visit(containsSchema, references, `${path}${index}`, value).next().done === true ? acc + 1 : acc, 0);
	if (containsCount === 0) yield Create(ValueErrorType.ArrayContains, schema, path, value);
	if (IsNumber$2(schema.minContains) && containsCount < schema.minContains) yield Create(ValueErrorType.ArrayMinContains, schema, path, value);
	if (IsNumber$2(schema.maxContains) && containsCount > schema.maxContains) yield Create(ValueErrorType.ArrayMaxContains, schema, path, value);
}
function* FromAsyncIterator(schema, references, path, value) {
	if (!IsAsyncIterator$2(value)) yield Create(ValueErrorType.AsyncIterator, schema, path, value);
}
function* FromBigInt(schema, references, path, value) {
	if (!IsBigInt$2(value)) return yield Create(ValueErrorType.BigInt, schema, path, value);
	if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) yield Create(ValueErrorType.BigIntExclusiveMaximum, schema, path, value);
	if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) yield Create(ValueErrorType.BigIntExclusiveMinimum, schema, path, value);
	if (IsDefined(schema.maximum) && !(value <= schema.maximum)) yield Create(ValueErrorType.BigIntMaximum, schema, path, value);
	if (IsDefined(schema.minimum) && !(value >= schema.minimum)) yield Create(ValueErrorType.BigIntMinimum, schema, path, value);
	if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) yield Create(ValueErrorType.BigIntMultipleOf, schema, path, value);
}
function* FromBoolean(schema, references, path, value) {
	if (!IsBoolean$2(value)) yield Create(ValueErrorType.Boolean, schema, path, value);
}
function* FromConstructor(schema, references, path, value) {
	yield* Visit(schema.returns, references, path, value.prototype);
}
function* FromDate(schema, references, path, value) {
	if (!IsDate$2(value)) return yield Create(ValueErrorType.Date, schema, path, value);
	if (IsDefined(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) yield Create(ValueErrorType.DateExclusiveMaximumTimestamp, schema, path, value);
	if (IsDefined(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) yield Create(ValueErrorType.DateExclusiveMinimumTimestamp, schema, path, value);
	if (IsDefined(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) yield Create(ValueErrorType.DateMaximumTimestamp, schema, path, value);
	if (IsDefined(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) yield Create(ValueErrorType.DateMinimumTimestamp, schema, path, value);
	if (IsDefined(schema.multipleOfTimestamp) && !(value.getTime() % schema.multipleOfTimestamp === 0)) yield Create(ValueErrorType.DateMultipleOfTimestamp, schema, path, value);
}
function* FromFunction(schema, references, path, value) {
	if (!IsFunction$2(value)) yield Create(ValueErrorType.Function, schema, path, value);
}
function* FromImport(schema, references, path, value) {
	const definitions = globalThis.Object.values(schema.$defs);
	const target = schema.$defs[schema.$ref];
	yield* Visit(target, [...references, ...definitions], path, value);
}
function* FromInteger(schema, references, path, value) {
	if (!IsInteger$2(value)) return yield Create(ValueErrorType.Integer, schema, path, value);
	if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) yield Create(ValueErrorType.IntegerExclusiveMaximum, schema, path, value);
	if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) yield Create(ValueErrorType.IntegerExclusiveMinimum, schema, path, value);
	if (IsDefined(schema.maximum) && !(value <= schema.maximum)) yield Create(ValueErrorType.IntegerMaximum, schema, path, value);
	if (IsDefined(schema.minimum) && !(value >= schema.minimum)) yield Create(ValueErrorType.IntegerMinimum, schema, path, value);
	if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === 0)) yield Create(ValueErrorType.IntegerMultipleOf, schema, path, value);
}
function* FromIntersect(schema, references, path, value) {
	let hasError = false;
	for (const inner of schema.allOf) for (const error of Visit(inner, references, path, value)) {
		hasError = true;
		yield error;
	}
	if (hasError) return yield Create(ValueErrorType.Intersect, schema, path, value);
	if (schema.unevaluatedProperties === false) {
		const keyCheck = new RegExp(KeyOfPattern(schema));
		for (const valueKey of Object.getOwnPropertyNames(value)) if (!keyCheck.test(valueKey)) yield Create(ValueErrorType.IntersectUnevaluatedProperties, schema, `${path}/${valueKey}`, value);
	}
	if (typeof schema.unevaluatedProperties === "object") {
		const keyCheck = new RegExp(KeyOfPattern(schema));
		for (const valueKey of Object.getOwnPropertyNames(value)) if (!keyCheck.test(valueKey)) {
			const next = Visit(schema.unevaluatedProperties, references, `${path}/${valueKey}`, value[valueKey]).next();
			if (!next.done) yield next.value;
		}
	}
}
function* FromIterator(schema, references, path, value) {
	if (!IsIterator$2(value)) yield Create(ValueErrorType.Iterator, schema, path, value);
}
function* FromLiteral(schema, references, path, value) {
	if (!(value === schema.const)) yield Create(ValueErrorType.Literal, schema, path, value);
}
function* FromNever(schema, references, path, value) {
	yield Create(ValueErrorType.Never, schema, path, value);
}
function* FromNot(schema, references, path, value) {
	if (Visit(schema.not, references, path, value).next().done === true) yield Create(ValueErrorType.Not, schema, path, value);
}
function* FromNull(schema, references, path, value) {
	if (!IsNull$2(value)) yield Create(ValueErrorType.Null, schema, path, value);
}
function* FromNumber(schema, references, path, value) {
	if (!TypeSystemPolicy.IsNumberLike(value)) return yield Create(ValueErrorType.Number, schema, path, value);
	if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) yield Create(ValueErrorType.NumberExclusiveMaximum, schema, path, value);
	if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) yield Create(ValueErrorType.NumberExclusiveMinimum, schema, path, value);
	if (IsDefined(schema.maximum) && !(value <= schema.maximum)) yield Create(ValueErrorType.NumberMaximum, schema, path, value);
	if (IsDefined(schema.minimum) && !(value >= schema.minimum)) yield Create(ValueErrorType.NumberMinimum, schema, path, value);
	if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === 0)) yield Create(ValueErrorType.NumberMultipleOf, schema, path, value);
}
function* FromObject(schema, references, path, value) {
	if (!TypeSystemPolicy.IsObjectLike(value)) return yield Create(ValueErrorType.Object, schema, path, value);
	if (IsDefined(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) yield Create(ValueErrorType.ObjectMinProperties, schema, path, value);
	if (IsDefined(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) yield Create(ValueErrorType.ObjectMaxProperties, schema, path, value);
	const requiredKeys = Array.isArray(schema.required) ? schema.required : [];
	const knownKeys = Object.getOwnPropertyNames(schema.properties);
	const unknownKeys = Object.getOwnPropertyNames(value);
	for (const requiredKey of requiredKeys) {
		if (unknownKeys.includes(requiredKey)) continue;
		yield Create(ValueErrorType.ObjectRequiredProperty, schema.properties[requiredKey], `${path}/${EscapeKey(requiredKey)}`, void 0);
	}
	if (schema.additionalProperties === false) {
		for (const valueKey of unknownKeys) if (!knownKeys.includes(valueKey)) yield Create(ValueErrorType.ObjectAdditionalProperties, schema, `${path}/${EscapeKey(valueKey)}`, value[valueKey]);
	}
	if (typeof schema.additionalProperties === "object") for (const valueKey of unknownKeys) {
		if (knownKeys.includes(valueKey)) continue;
		yield* Visit(schema.additionalProperties, references, `${path}/${EscapeKey(valueKey)}`, value[valueKey]);
	}
	for (const knownKey of knownKeys) {
		const property = schema.properties[knownKey];
		if (schema.required && schema.required.includes(knownKey)) {
			yield* Visit(property, references, `${path}/${EscapeKey(knownKey)}`, value[knownKey]);
			if (ExtendsUndefinedCheck(schema) && !(knownKey in value)) yield Create(ValueErrorType.ObjectRequiredProperty, property, `${path}/${EscapeKey(knownKey)}`, void 0);
		} else if (TypeSystemPolicy.IsExactOptionalProperty(value, knownKey)) yield* Visit(property, references, `${path}/${EscapeKey(knownKey)}`, value[knownKey]);
	}
}
function* FromPromise(schema, references, path, value) {
	if (!IsPromise$2(value)) yield Create(ValueErrorType.Promise, schema, path, value);
}
function* FromRecord(schema, references, path, value) {
	if (!TypeSystemPolicy.IsRecordLike(value)) return yield Create(ValueErrorType.Object, schema, path, value);
	if (IsDefined(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) yield Create(ValueErrorType.ObjectMinProperties, schema, path, value);
	if (IsDefined(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) yield Create(ValueErrorType.ObjectMaxProperties, schema, path, value);
	const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0];
	const regex = new RegExp(patternKey);
	for (const [propertyKey, propertyValue] of Object.entries(value)) if (regex.test(propertyKey)) yield* Visit(patternSchema, references, `${path}/${EscapeKey(propertyKey)}`, propertyValue);
	if (typeof schema.additionalProperties === "object") {
		for (const [propertyKey, propertyValue] of Object.entries(value)) if (!regex.test(propertyKey)) yield* Visit(schema.additionalProperties, references, `${path}/${EscapeKey(propertyKey)}`, propertyValue);
	}
	if (schema.additionalProperties === false) for (const [propertyKey, propertyValue] of Object.entries(value)) {
		if (regex.test(propertyKey)) continue;
		return yield Create(ValueErrorType.ObjectAdditionalProperties, schema, `${path}/${EscapeKey(propertyKey)}`, propertyValue);
	}
}
function* FromRef(schema, references, path, value) {
	yield* Visit(Deref(schema, references), references, path, value);
}
function* FromRegExp(schema, references, path, value) {
	if (!IsString$2(value)) return yield Create(ValueErrorType.String, schema, path, value);
	if (IsDefined(schema.minLength) && !(value.length >= schema.minLength)) yield Create(ValueErrorType.StringMinLength, schema, path, value);
	if (IsDefined(schema.maxLength) && !(value.length <= schema.maxLength)) yield Create(ValueErrorType.StringMaxLength, schema, path, value);
	if (!new RegExp(schema.source, schema.flags).test(value)) return yield Create(ValueErrorType.RegExp, schema, path, value);
}
function* FromString(schema, references, path, value) {
	if (!IsString$2(value)) return yield Create(ValueErrorType.String, schema, path, value);
	if (IsDefined(schema.minLength) && !(value.length >= schema.minLength)) yield Create(ValueErrorType.StringMinLength, schema, path, value);
	if (IsDefined(schema.maxLength) && !(value.length <= schema.maxLength)) yield Create(ValueErrorType.StringMaxLength, schema, path, value);
	if (IsString$2(schema.pattern)) {
		if (!new RegExp(schema.pattern).test(value)) yield Create(ValueErrorType.StringPattern, schema, path, value);
	}
	if (IsString$2(schema.format)) {
		if (!Has$1(schema.format)) yield Create(ValueErrorType.StringFormatUnknown, schema, path, value);
		else if (!Get$1(schema.format)(value)) yield Create(ValueErrorType.StringFormat, schema, path, value);
	}
}
function* FromSymbol(schema, references, path, value) {
	if (!IsSymbol$2(value)) yield Create(ValueErrorType.Symbol, schema, path, value);
}
function* FromTemplateLiteral(schema, references, path, value) {
	if (!IsString$2(value)) return yield Create(ValueErrorType.String, schema, path, value);
	if (!new RegExp(schema.pattern).test(value)) yield Create(ValueErrorType.StringPattern, schema, path, value);
}
function* FromThis(schema, references, path, value) {
	yield* Visit(Deref(schema, references), references, path, value);
}
function* FromTuple(schema, references, path, value) {
	if (!IsArray$2(value)) return yield Create(ValueErrorType.Tuple, schema, path, value);
	if (schema.items === void 0 && !(value.length === 0)) return yield Create(ValueErrorType.TupleLength, schema, path, value);
	if (!(value.length === schema.maxItems)) return yield Create(ValueErrorType.TupleLength, schema, path, value);
	if (!schema.items) return;
	for (let i = 0; i < schema.items.length; i++) yield* Visit(schema.items[i], references, `${path}/${i}`, value[i]);
}
function* FromUndefined(schema, references, path, value) {
	if (!IsUndefined$2(value)) yield Create(ValueErrorType.Undefined, schema, path, value);
}
function* FromUnion(schema, references, path, value) {
	if (Check(schema, references, value)) return;
	const errors = schema.anyOf.map((variant) => new ValueErrorIterator(Visit(variant, references, path, value)));
	yield Create(ValueErrorType.Union, schema, path, value, errors);
}
function* FromUint8Array(schema, references, path, value) {
	if (!IsUint8Array$2(value)) return yield Create(ValueErrorType.Uint8Array, schema, path, value);
	if (IsDefined(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) yield Create(ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value);
	if (IsDefined(schema.minByteLength) && !(value.length >= schema.minByteLength)) yield Create(ValueErrorType.Uint8ArrayMinByteLength, schema, path, value);
}
function* FromUnknown(schema, references, path, value) {}
function* FromVoid(schema, references, path, value) {
	if (!TypeSystemPolicy.IsVoidLike(value)) yield Create(ValueErrorType.Void, schema, path, value);
}
function* FromKind(schema, references, path, value) {
	if (!Get(schema[Kind])(schema, value)) yield Create(ValueErrorType.Kind, schema, path, value);
}
function* Visit(schema, references, path, value) {
	const references_ = IsDefined(schema.$id) ? [...references, schema] : references;
	const schema_ = schema;
	switch (schema_[Kind]) {
		case "Any": return yield* FromAny(schema_, references_, path, value);
		case "Argument": return yield* FromArgument(schema_, references_, path, value);
		case "Array": return yield* FromArray(schema_, references_, path, value);
		case "AsyncIterator": return yield* FromAsyncIterator(schema_, references_, path, value);
		case "BigInt": return yield* FromBigInt(schema_, references_, path, value);
		case "Boolean": return yield* FromBoolean(schema_, references_, path, value);
		case "Constructor": return yield* FromConstructor(schema_, references_, path, value);
		case "Date": return yield* FromDate(schema_, references_, path, value);
		case "Function": return yield* FromFunction(schema_, references_, path, value);
		case "Import": return yield* FromImport(schema_, references_, path, value);
		case "Integer": return yield* FromInteger(schema_, references_, path, value);
		case "Intersect": return yield* FromIntersect(schema_, references_, path, value);
		case "Iterator": return yield* FromIterator(schema_, references_, path, value);
		case "Literal": return yield* FromLiteral(schema_, references_, path, value);
		case "Never": return yield* FromNever(schema_, references_, path, value);
		case "Not": return yield* FromNot(schema_, references_, path, value);
		case "Null": return yield* FromNull(schema_, references_, path, value);
		case "Number": return yield* FromNumber(schema_, references_, path, value);
		case "Object": return yield* FromObject(schema_, references_, path, value);
		case "Promise": return yield* FromPromise(schema_, references_, path, value);
		case "Record": return yield* FromRecord(schema_, references_, path, value);
		case "Ref": return yield* FromRef(schema_, references_, path, value);
		case "RegExp": return yield* FromRegExp(schema_, references_, path, value);
		case "String": return yield* FromString(schema_, references_, path, value);
		case "Symbol": return yield* FromSymbol(schema_, references_, path, value);
		case "TemplateLiteral": return yield* FromTemplateLiteral(schema_, references_, path, value);
		case "This": return yield* FromThis(schema_, references_, path, value);
		case "Tuple": return yield* FromTuple(schema_, references_, path, value);
		case "Undefined": return yield* FromUndefined(schema_, references_, path, value);
		case "Union": return yield* FromUnion(schema_, references_, path, value);
		case "Uint8Array": return yield* FromUint8Array(schema_, references_, path, value);
		case "Unknown": return yield* FromUnknown(schema_, references_, path, value);
		case "Void": return yield* FromVoid(schema_, references_, path, value);
		default:
			if (!Has(schema_[Kind])) throw new ValueErrorsUnknownTypeError(schema);
			return yield* FromKind(schema_, references_, path, value);
	}
}
/** Returns an iterator for each error in this value. */
function Errors(...args) {
	return new ValueErrorIterator(args.length === 3 ? Visit(args[0], args[1], "", args[2]) : Visit(args[0], [], "", args[1]));
}
//#endregion
//#region ../dsgraph-schema/dist/validate.js
/** Validation without code generation (safe under strict CSP, e.g. in browser extensions). */
function validate(schema, value) {
	if (Check(schema, value)) return {
		ok: true,
		errors: []
	};
	return {
		ok: false,
		errors: [...Errors(schema, value)].slice(0, 50).map((e) => ({
			path: e.path,
			message: e.message
		}))
	};
}
const validateSnapshot = (value) => validate(Snapshot, value);
const validateConfig = (value) => validate(Config, value);
//#endregion
//#region ../dsgraph-core/dist/diagnostics.js
/** Collects diagnostics, deduplicating identical entries. */
var DiagnosticBag = class {
	items = /* @__PURE__ */ new Map();
	add(code, severity, message, loc) {
		const d = loc ? {
			code,
			severity,
			message,
			loc
		} : {
			code,
			severity,
			message
		};
		const key = canonicalize(d);
		if (!this.items.has(key)) this.items.set(key, d);
	}
	error(code, message, loc) {
		this.add(code, "error", message, loc);
	}
	warn(code, message, loc) {
		this.add(code, "warning", message, loc);
	}
	info(code, message, loc) {
		this.add(code, "info", message, loc);
	}
	merge(other) {
		for (const d of other.list()) this.add(d.code, d.severity, d.message, d.loc);
	}
	hasErrors() {
		for (const d of this.items.values()) if (d.severity === "error") return true;
		return false;
	}
	/** Sorted by file, pointer, code, message for deterministic output. */
	list() {
		return [...this.items.values()].sort((a, b) => (a.loc?.file ?? "").localeCompare(b.loc?.file ?? "") || (a.loc?.pointer ?? "").localeCompare(b.loc?.pointer ?? "") || a.code.localeCompare(b.code) || a.message.localeCompare(b.message));
	}
};
//#endregion
//#region ../dsgraph-core/dist/path.js
/** Token paths, dot-path globs and cross-source name normalization. */
const tokenId = (path) => path.join(".");
const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const segmentRegex = /* @__PURE__ */ new Map();
function segmentMatches(pattern, segment) {
	if (pattern === "*") return true;
	if (!pattern.includes("*")) return pattern === segment;
	let re = segmentRegex.get(pattern);
	if (!re) {
		re = new RegExp(`^${pattern.split("*").map(escapeRegex).join(".*")}$`);
		segmentRegex.set(pattern, re);
	}
	return re.test(segment);
}
/**
* Matches a dot-path token id against a dot-path glob:
* `*` matches one segment (or part of it), `**` matches zero or more segments.
*/
function matchPath(id, pattern) {
	const s = id === "" ? [] : id.split(".");
	const p = pattern === "" ? [] : pattern.split(".");
	const memo = /* @__PURE__ */ new Map();
	const go = (i, j) => {
		const key = `${i}:${j}`;
		const cached = memo.get(key);
		if (cached !== void 0) return cached;
		let r;
		if (j === p.length) r = i === s.length;
		else if (p[j] === "**") r = go(i, j + 1) || i < s.length && go(i + 1, j);
		else r = i < s.length && segmentMatches(p[j], s[i]) && go(i + 1, j + 1);
		memo.set(key, r);
		return r;
	};
	return go(0, 0);
}
function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/** Converts a file glob (`**`, `*`, `?`, `{a,b}`) to a RegExp over posix paths. */
function globToRegExp(glob) {
	let re = "";
	let i = 0;
	while (i < glob.length) {
		const c = glob[i];
		if (c === "*") {
			if (glob[i + 1] === "*") {
				if ((i === 0 || glob[i - 1] === "/") && glob[i + 2] === "/") {
					re += "(?:.*/)?";
					i += 3;
					continue;
				}
				re += ".*";
				i += 2;
				continue;
			}
			re += "[^/]*";
		} else if (c === "?") re += "[^/]";
		else if (c === "{") {
			const end = glob.indexOf("}", i);
			if (end > i) {
				re += `(?:${glob.slice(i + 1, end).split(",").map((alt) => globToRegExp(alt).source.slice(1, -1)).join("|")})`;
				i = end + 1;
				continue;
			}
			re += "\\{";
		} else re += escapeRegex(c);
		i++;
	}
	return new RegExp(`^${re}$`);
}
function matchGlob(path, patterns) {
	const list = typeof patterns === "string" ? [patterns] : patterns;
	let included = false;
	for (const p of list) if (p.startsWith("!")) {
		if (globToRegExp(p.slice(1)).test(path)) return false;
	} else if (globToRegExp(p).test(path)) included = true;
	return included;
}
/**
* Normalized name used only to match tokens across sources (CSS, Figma), never as an id:
* drops `$root`, splits camelCase, maps separators to dots, lowercases.
*/
function normalizeName(name) {
	return name.replace(/\$root/g, "").replace(/([a-z0-9])([A-Z])/g, "$1.$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1.$2").toLowerCase().replace(/[\s\-_/.]+/g, ".").replace(/^\.+|\.+$/g, "");
}
/** Normalized token path for a CSS custom property, after stripping `--` and an optional prefix. */
function cssVarToName(cssVar, prefix = "--") {
	let n = cssVar.trim();
	if (prefix && n.startsWith(prefix)) n = n.slice(prefix.length);
	else if (n.startsWith("--")) n = n.slice(2);
	return normalizeName(n);
}
//#endregion
//#region ../dsgraph-core/dist/pointer.js
/** JSON Pointer helpers (RFC 6901). */
const escapeSegment = (s) => s.replace(/~/g, "~0").replace(/\//g, "~1");
const unescapeSegment = (s) => s.replace(/~1/g, "/").replace(/~0/g, "~");
function toPointer(segments) {
	return segments.map((s) => `/${escapeSegment(String(s))}`).join("");
}
/** Parses `#/a/b`, `/a/b` or `#` into segments; returns null for invalid syntax. */
function parsePointer(pointer) {
	let p = pointer;
	if (p.startsWith("#")) p = p.slice(1);
	if (p === "") return [];
	if (!p.startsWith("/")) return null;
	return p.slice(1).split("/").map(unescapeSegment);
}
function getAt(value, segments) {
	let cur = value;
	for (const seg of segments) if (Array.isArray(cur)) {
		if (!/^(0|[1-9]\d*)$/.test(seg)) return {
			found: false,
			value: void 0
		};
		const i = Number(seg);
		if (i >= cur.length) return {
			found: false,
			value: void 0
		};
		cur = cur[i];
	} else if (cur !== null && typeof cur === "object" && Object.hasOwn(cur, seg)) cur = cur[seg];
	else return {
		found: false,
		value: void 0
	};
	return {
		found: true,
		value: cur
	};
}
//#endregion
//#region ../dsgraph-core/dist/resolver/system.js
/** Wraps plain token files into a synthetic system with one set and no modifiers. */
function systemFromDocuments(docs) {
	return {
		sets: /* @__PURE__ */ new Map([["default", docs]]),
		modifiers: /* @__PURE__ */ new Map(),
		order: [{
			kind: "set",
			name: "default"
		}],
		synthetic: true
	};
}
const ACCEPTED_VERSIONS = /* @__PURE__ */ new Set([
	"2025.10",
	"2025-10-01",
	"2025-11-01"
]);
function dirname$3(path) {
	const i = path.lastIndexOf("/");
	return i < 0 ? "" : path.slice(0, i);
}
function joinPath(base, rel) {
	const parts = (base ? `${base}/${rel}` : rel).split("/");
	const out = [];
	for (const p of parts) {
		if (p === "" || p === ".") continue;
		if (p === "..") out.pop();
		else out.push(p);
	}
	return out.join("/");
}
/**
* Parses a resolver document (Resolver 2025.10). Tolerant of known inconsistencies in the
* specification itself (version spelled as a date, `context` instead of `contexts`).
*/
async function systemFromResolver(tree, file, load, diag) {
	const system = {
		sets: /* @__PURE__ */ new Map(),
		modifiers: /* @__PURE__ */ new Map(),
		order: [],
		synthetic: false,
		file
	};
	const at = (pointer) => ({
		file,
		pointer
	});
	if (!isPlainObject(tree)) {
		diag.error("resolver/invalid-document", "A resolver document must be a JSON object", at(""));
		return system;
	}
	if (tree.version === void 0) diag.error("resolver/missing-version", "Resolver must declare \"version\"", at(""));
	else if (!ACCEPTED_VERSIONS.has(String(tree.version))) diag.warn("resolver/unknown-version", `Unknown resolver version "${String(tree.version)}"`, at("/version"));
	else if (tree.version !== "2025.10") diag.info("resolver/version-date", `Version "${String(tree.version)}" is read as 2025.10`, at("/version"));
	const fileCache = /* @__PURE__ */ new Map();
	const loadFile = async (path) => {
		if (!fileCache.has(path)) fileCache.set(path, await load(path));
		return fileCache.get(path);
	};
	const sourcesOf = async (items, pointer, allowSetRefs) => {
		if (!Array.isArray(items)) {
			diag.error("resolver/invalid-sources", "Sources must be an array", at(pointer));
			return [];
		}
		const docs = [];
		for (const [i, item] of items.entries()) {
			const p = `${pointer}/${i}`;
			if (!isPlainObject(item)) {
				diag.error("resolver/invalid-source", "Each source must be a reference object or inline tokens", at(p));
				continue;
			}
			if (typeof item.$ref !== "string") {
				docs.push({
					file: `${file}#${p}`,
					tree: item
				});
				continue;
			}
			const { $ref, ...siblings } = item;
			const ref = $ref;
			if (ref.startsWith("#")) {
				const segs = parsePointer(ref);
				if (!segs) {
					diag.error("resolver/invalid-pointer", `Malformed pointer "${ref}"`, at(p));
					continue;
				}
				if (segs[0] === "modifiers" || segs[0] === "resolutionOrder") {
					diag.error("resolver/invalid-pointer", `Sources must not reference "${ref}"`, at(p));
					continue;
				}
				if (segs[0] === "sets" && segs.length === 2) {
					if (!allowSetRefs) continue;
					const set = isPlainObject(tree.sets) ? tree.sets[segs[1]] : void 0;
					if (!isPlainObject(set)) diag.error("resolver/invalid-pointer", `Set "${segs[1]}" not found`, at(p));
					else docs.push(...await sourcesOf(set.sources, toPointer([
						"sets",
						segs[1],
						"sources"
					]), false));
					continue;
				}
				const found = getAt(tree, segs);
				if (!found.found) diag.error("resolver/invalid-pointer", `"${ref}" not found`, at(p));
				else docs.push({
					file: `${file}#${toPointer(segs)}`,
					tree: override(found.value, siblings)
				});
				continue;
			}
			if (/^[a-z]+:\/\//i.test(ref)) {
				diag.warn("resolver/remote-unsupported", `Remote source "${ref}" is not loaded`, at(p));
				continue;
			}
			const [filePart, fragment] = ref.split("#");
			const path = joinPath(dirname$3(file), filePart);
			let content;
			try {
				content = await loadFile(path);
			} catch (e) {
				diag.error("resolver/source-not-found", `Cannot load "${path}": ${e.message}`, at(p));
				continue;
			}
			if (fragment !== void 0) {
				const segs = parsePointer(fragment.startsWith("/") ? fragment : `/${fragment}`);
				const found = segs ? getAt(content, segs) : {
					found: false,
					value: void 0
				};
				if (!found.found) {
					diag.error("resolver/invalid-pointer", `"${ref}" not found`, at(p));
					continue;
				}
				content = found.value;
			}
			docs.push({
				file: fragment !== void 0 ? `${path}#${fragment}` : path,
				tree: override(content, siblings)
			});
		}
		return docs;
	};
	const defineSet = async (name, def, pointer) => {
		if (!isPlainObject(def)) {
			diag.error("resolver/invalid-set", `Set "${name}" must be an object`, at(pointer));
			return;
		}
		system.sets.set(name, await sourcesOf(def.sources, `${pointer}/sources`, true));
	};
	const defineModifier = async (name, def, pointer) => {
		if (!isPlainObject(def)) {
			diag.error("resolver/invalid-modifier", `Modifier "${name}" must be an object`, at(pointer));
			return;
		}
		let contexts = def.contexts;
		let key = "contexts";
		if (contexts === void 0 && def.context !== void 0) {
			contexts = def.context;
			key = "context";
			diag.warn("resolver/context-typo", `Modifier "${name}" uses "context"; the property is "contexts"`, at(pointer));
		}
		if (!isPlainObject(contexts) || Object.keys(contexts).length === 0) {
			diag.error("resolver/no-contexts", `Modifier "${name}" must declare at least one context`, at(pointer));
			return;
		}
		if (Object.keys(contexts).length === 1) diag.warn("resolver/single-context", `Modifier "${name}" has a single context; use a set instead`, at(pointer));
		const m = { contexts: /* @__PURE__ */ new Map() };
		for (const [ctx, items] of Object.entries(contexts)) m.contexts.set(ctx, await sourcesOf(items, `${pointer}/${key}/${ctx}`, true));
		if (def.default !== void 0) {
			if (typeof def.default === "string" && m.contexts.has(def.default)) m.default = def.default;
			else diag.error("resolver/invalid-default", `Default "${String(def.default)}" is not a context of "${name}"`, at(pointer));
		}
		if (typeof def.description === "string") m.description = def.description;
		system.modifiers.set(name, m);
	};
	const setDefs = isPlainObject(tree.sets) ? tree.sets : {};
	const modifierDefs = isPlainObject(tree.modifiers) ? tree.modifiers : {};
	let order = tree.resolutionOrder;
	if (!Array.isArray(order)) {
		diag.error("resolver/missing-resolution-order", "Resolver must declare \"resolutionOrder\"", at(""));
		order = [...Object.keys(setDefs).map((n) => ({ $ref: `#/sets/${n}` })), ...Object.keys(modifierDefs).map((n) => ({ $ref: `#/modifiers/${n}` }))];
	}
	const seen = /* @__PURE__ */ new Set();
	for (const [i, item] of order.entries()) {
		const p = `/resolutionOrder/${i}`;
		if (!isPlainObject(item)) {
			diag.error("resolver/invalid-order-item", "Resolution order items must be objects", at(p));
			continue;
		}
		let kind;
		let name;
		if (typeof item.$ref === "string") {
			const segs = parsePointer(item.$ref);
			if (segs && segs.length === 2 && (segs[0] === "sets" || segs[0] === "modifiers")) {
				kind = segs[0] === "sets" ? "set" : "modifier";
				name = segs[1];
				const defs = kind === "set" ? setDefs : modifierDefs;
				if (!(name in defs)) {
					diag.error("resolver/invalid-pointer", `"${item.$ref}" not found`, at(p));
					continue;
				}
				if (kind === "set" && !system.sets.has(name)) await defineSet(name, defs[name], `/sets/${name}`);
				if (kind === "modifier" && !system.modifiers.has(name)) await defineModifier(name, defs[name], `/modifiers/${name}`);
			} else {
				diag.error("resolver/invalid-pointer", `Resolution order must reference a set or modifier`, at(p));
				continue;
			}
		} else if ((item.type === "set" || item.type === "modifier") && typeof item.name === "string") {
			kind = item.type;
			name = item.name;
			if (kind === "set") await defineSet(name, item, p);
			else await defineModifier(name, item, p);
		} else {
			diag.error("resolver/invalid-order-item", "Inline items need \"type\" (set | modifier) and \"name\"", at(p));
			continue;
		}
		if (seen.has(name)) diag.error("resolver/duplicate-name", `"${name}" appears twice in resolutionOrder`, at(p));
		seen.add(name);
		system.order.push({
			kind,
			name
		});
	}
	return system;
}
function override(value, siblings) {
	if (Object.keys(siblings).length === 0 || !isPlainObject(value)) return value;
	return {
		...value,
		...siblings
	};
}
/** Modifiers in resolution order with contexts in declaration order. */
function modifiersOf(system) {
	const out = [];
	for (const item of system.order) {
		if (item.kind !== "modifier") continue;
		const m = system.modifiers.get(item.name);
		if (!m) continue;
		const mod = {
			name: item.name,
			contexts: [...m.contexts.keys()]
		};
		if (m.default) mod.default = m.default;
		out.push(mod);
	}
	return out;
}
/** Cartesian product of all modifier contexts, deterministic order. */
function enumerateInputs(modifiers) {
	let inputs = [{}];
	for (const m of modifiers) inputs = inputs.flatMap((i) => m.contexts.map((c) => ({
		...i,
		[m.name]: c
	})));
	return inputs;
}
function defaultInput(modifiers, configured = {}) {
	const input = {};
	for (const m of modifiers) {
		const c = configured[m.name];
		input[m.name] = c !== void 0 && m.contexts.includes(c) ? c : m.default ?? m.contexts[0];
	}
	return input;
}
/** Documents for an input, in resolution order. */
function selectDocuments(system, input) {
	const docs = [];
	for (const item of system.order) if (item.kind === "set") docs.push(...system.sets.get(item.name) ?? []);
	else {
		const m = system.modifiers.get(item.name);
		const ctx = input[item.name];
		if (m && ctx !== void 0) docs.push(...m.contexts.get(ctx) ?? []);
	}
	return docs;
}
//#endregion
//#region ../../node_modules/culori/src/rgb/parseNumber.js
const parseNumber = (color, len) => {
	if (typeof color !== "number") return;
	if (len === 3) return {
		mode: "rgb",
		r: (color >> 8 & 15 | color >> 4 & 240) / 255,
		g: (color >> 4 & 15 | color & 240) / 255,
		b: (color & 15 | color << 4 & 240) / 255
	};
	if (len === 4) return {
		mode: "rgb",
		r: (color >> 12 & 15 | color >> 8 & 240) / 255,
		g: (color >> 8 & 15 | color >> 4 & 240) / 255,
		b: (color >> 4 & 15 | color & 240) / 255,
		alpha: (color & 15 | color << 4 & 240) / 255
	};
	if (len === 6) return {
		mode: "rgb",
		r: (color >> 16 & 255) / 255,
		g: (color >> 8 & 255) / 255,
		b: (color & 255) / 255
	};
	if (len === 8) return {
		mode: "rgb",
		r: (color >> 24 & 255) / 255,
		g: (color >> 16 & 255) / 255,
		b: (color >> 8 & 255) / 255,
		alpha: (color & 255) / 255
	};
};
//#endregion
//#region ../../node_modules/culori/src/colors/named.js
const named = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
//#endregion
//#region ../../node_modules/culori/src/rgb/parseNamed.js
const parseNamed = (color) => {
	return parseNumber(named[color.toLowerCase()], 6);
};
//#endregion
//#region ../../node_modules/culori/src/rgb/parseHex.js
const hex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;
const parseHex = (color) => {
	let match;
	return (match = color.match(hex)) ? parseNumber(parseInt(match[1], 16), match[1].length) : void 0;
};
//#endregion
//#region ../../node_modules/culori/src/util/regex.js
const num$1 = "([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)";
const per = `${num$1}%`;
const num_per = `(?:${num$1}%|${num$1})`;
const num_per_none = `(?:${num$1}%|${num$1}|none)`;
const hue$1 = `(?:${num$1}(deg|grad|rad|turn)|${num$1})`;
const c = `\\s*,\\s*`;
new RegExp("^" + num_per_none + "$");
//#endregion
//#region ../../node_modules/culori/src/rgb/parseRgbLegacy.js
const rgb_num_old = new RegExp(`^rgba?\\(\\s*${num$1}${c}${num$1}${c}${num$1}\\s*(?:,\\s*${num_per}\\s*)?\\)$`);
const rgb_per_old = new RegExp(`^rgba?\\(\\s*${per}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`);
const parseRgbLegacy = (color) => {
	let res = { mode: "rgb" };
	let match;
	if (match = color.match(rgb_num_old)) {
		if (match[1] !== void 0) res.r = match[1] / 255;
		if (match[2] !== void 0) res.g = match[2] / 255;
		if (match[3] !== void 0) res.b = match[3] / 255;
	} else if (match = color.match(rgb_per_old)) {
		if (match[1] !== void 0) res.r = match[1] / 100;
		if (match[2] !== void 0) res.g = match[2] / 100;
		if (match[3] !== void 0) res.b = match[3] / 100;
	} else return;
	if (match[4] !== void 0) res.alpha = Math.max(0, Math.min(1, match[4] / 100));
	else if (match[5] !== void 0) res.alpha = Math.max(0, Math.min(1, +match[5]));
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/_prepare.js
const prepare = (color, mode) => color === void 0 ? void 0 : typeof color !== "object" ? parse$2(color) : color.mode !== void 0 ? color : mode ? {
	...color,
	mode
} : void 0;
//#endregion
//#region ../../node_modules/culori/src/converter.js
const converter = (target_mode = "rgb") => (color) => (color = prepare(color, target_mode)) !== void 0 ? color.mode === target_mode ? color : converters[color.mode][target_mode] ? converters[color.mode][target_mode](color) : target_mode === "rgb" ? converters[color.mode].rgb(color) : converters.rgb[target_mode](converters[color.mode].rgb(color)) : void 0;
//#endregion
//#region ../../node_modules/culori/src/modes.js
const converters = {};
const modes = {};
const parsers = [];
const colorProfiles = {};
const identity = (v) => v;
const useMode = (definition) => {
	converters[definition.mode] = {
		...converters[definition.mode],
		...definition.toMode
	};
	Object.keys(definition.fromMode || {}).forEach((k) => {
		if (!converters[k]) converters[k] = {};
		converters[k][definition.mode] = definition.fromMode[k];
	});
	if (!definition.ranges) definition.ranges = {};
	if (!definition.difference) definition.difference = {};
	definition.channels.forEach((channel) => {
		if (definition.ranges[channel] === void 0) definition.ranges[channel] = [0, 1];
		if (!definition.interpolate[channel]) throw new Error(`Missing interpolator for: ${channel}`);
		if (typeof definition.interpolate[channel] === "function") definition.interpolate[channel] = { use: definition.interpolate[channel] };
		if (!definition.interpolate[channel].fixup) definition.interpolate[channel].fixup = identity;
	});
	modes[definition.mode] = definition;
	(definition.parse || []).forEach((parser) => {
		useParser(parser, definition.mode);
	});
	return converter(definition.mode);
};
const getMode = (mode) => modes[mode];
const useParser = (parser, mode) => {
	if (typeof parser === "string") {
		if (!mode) throw new Error(`'mode' required when 'parser' is a string`);
		colorProfiles[parser] = mode;
	} else if (typeof parser === "function") {
		if (parsers.indexOf(parser) < 0) parsers.push(parser);
	}
};
//#endregion
//#region ../../node_modules/culori/src/parse.js
const IdentStartCodePoint = /[^\x00-\x7F]|[a-zA-Z_]/;
const IdentCodePoint = /[^\x00-\x7F]|[-\w]/;
const Tok = {
	Function: "function",
	Ident: "ident",
	Number: "number",
	Percentage: "percentage",
	ParenClose: ")",
	None: "none",
	Hue: "hue",
	Alpha: "alpha"
};
let _i = 0;
function is_num(chars) {
	let ch = chars[_i];
	let ch1 = chars[_i + 1];
	if (ch === "-" || ch === "+") return /\d/.test(ch1) || ch1 === "." && /\d/.test(chars[_i + 2]);
	if (ch === ".") return /\d/.test(ch1);
	return /\d/.test(ch);
}
function is_ident(chars) {
	if (_i >= chars.length) return false;
	let ch = chars[_i];
	if (IdentStartCodePoint.test(ch)) return true;
	if (ch === "-") {
		if (chars.length - _i < 2) return false;
		let ch1 = chars[_i + 1];
		if (ch1 === "-" || IdentStartCodePoint.test(ch1)) return true;
		return false;
	}
	return false;
}
const huenits = {
	deg: 1,
	rad: 180 / Math.PI,
	grad: 9 / 10,
	turn: 360
};
function num(chars) {
	let value = "";
	if (chars[_i] === "-" || chars[_i] === "+") value += chars[_i++];
	value += digits(chars);
	if (chars[_i] === "." && /\d/.test(chars[_i + 1])) value += chars[_i++] + digits(chars);
	if (chars[_i] === "e" || chars[_i] === "E") {
		if ((chars[_i + 1] === "-" || chars[_i + 1] === "+") && /\d/.test(chars[_i + 2])) value += chars[_i++] + chars[_i++] + digits(chars);
		else if (/\d/.test(chars[_i + 1])) value += chars[_i++] + digits(chars);
	}
	if (is_ident(chars)) {
		let id = ident(chars);
		if (id === "deg" || id === "rad" || id === "turn" || id === "grad") return {
			type: Tok.Hue,
			value: value * huenits[id]
		};
		return;
	}
	if (chars[_i] === "%") {
		_i++;
		return {
			type: Tok.Percentage,
			value: +value
		};
	}
	return {
		type: Tok.Number,
		value: +value
	};
}
function digits(chars) {
	let v = "";
	while (/\d/.test(chars[_i])) v += chars[_i++];
	return v;
}
function ident(chars) {
	let v = "";
	while (_i < chars.length && IdentCodePoint.test(chars[_i])) v += chars[_i++];
	return v;
}
function identlike(chars) {
	let v = ident(chars);
	if (chars[_i] === "(") {
		_i++;
		return {
			type: Tok.Function,
			value: v
		};
	}
	if (v === "none") return {
		type: Tok.None,
		value: void 0
	};
	return {
		type: Tok.Ident,
		value: v
	};
}
function tokenize(str = "") {
	let chars = str.trim();
	let tokens = [];
	let ch;
	_i = 0;
	while (_i < chars.length) {
		ch = chars[_i++];
		if (ch === "\n" || ch === "	" || ch === " ") {
			while (_i < chars.length && (chars[_i] === "\n" || chars[_i] === "	" || chars[_i] === " ")) _i++;
			continue;
		}
		if (ch === ",") return;
		if (ch === ")") {
			tokens.push({ type: Tok.ParenClose });
			continue;
		}
		if (ch === "+") {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			return;
		}
		if (ch === "-") {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			if (is_ident(chars)) {
				tokens.push({
					type: Tok.Ident,
					value: ident(chars)
				});
				continue;
			}
			return;
		}
		if (ch === ".") {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			return;
		}
		if (ch === "/") {
			while (_i < chars.length && (chars[_i] === "\n" || chars[_i] === "	" || chars[_i] === " ")) _i++;
			let alpha;
			if (is_num(chars)) {
				alpha = num(chars);
				if (alpha.type !== Tok.Hue) {
					tokens.push({
						type: Tok.Alpha,
						value: alpha
					});
					continue;
				}
			}
			if (is_ident(chars)) {
				if (ident(chars) === "none") {
					tokens.push({
						type: Tok.Alpha,
						value: {
							type: Tok.None,
							value: void 0
						}
					});
					continue;
				}
			}
			return;
		}
		if (/\d/.test(ch)) {
			_i--;
			tokens.push(num(chars));
			continue;
		}
		if (IdentStartCodePoint.test(ch)) {
			_i--;
			tokens.push(identlike(chars));
			continue;
		}
		return;
	}
	return tokens;
}
function parseColorSyntax(tokens) {
	tokens._i = 0;
	let token = tokens[tokens._i++];
	if (!token || token.type !== Tok.Function || token.value !== "color") return;
	token = tokens[tokens._i++];
	if (token.type !== Tok.Ident) return;
	const mode = colorProfiles[token.value];
	if (!mode) return;
	const res = { mode };
	const coords = consumeCoords(tokens, false);
	if (!coords) return;
	const channels = getMode(mode).channels;
	for (let ii = 0, c, ch; ii < channels.length; ii++) {
		c = coords[ii];
		ch = channels[ii];
		if (c.type !== Tok.None) {
			res[ch] = c.type === Tok.Number ? c.value : c.value / 100;
			if (ch === "alpha") res[ch] = Math.max(0, Math.min(1, res[ch]));
		}
	}
	return res;
}
function consumeCoords(tokens, includeHue) {
	const coords = [];
	let token;
	while (tokens._i < tokens.length) {
		token = tokens[tokens._i++];
		if (token.type === Tok.None || token.type === Tok.Number || token.type === Tok.Alpha || token.type === Tok.Percentage || includeHue && token.type === Tok.Hue) {
			coords.push(token);
			continue;
		}
		if (token.type === Tok.ParenClose) {
			if (tokens._i < tokens.length) return;
			continue;
		}
		return;
	}
	if (coords.length < 3 || coords.length > 4) return;
	if (coords.length === 4) {
		if (coords[3].type !== Tok.Alpha) return;
		coords[3] = coords[3].value;
	}
	if (coords.length === 3) coords.push({
		type: Tok.None,
		value: void 0
	});
	return coords.every((c) => c.type !== Tok.Alpha) ? coords : void 0;
}
function parseModernSyntax(tokens, includeHue) {
	tokens._i = 0;
	let token = tokens[tokens._i++];
	if (!token || token.type !== Tok.Function) return;
	let coords = consumeCoords(tokens, includeHue);
	if (!coords) return;
	coords.unshift(token.value);
	return coords;
}
const parse$2 = (color) => {
	if (typeof color !== "string") return;
	const tokens = tokenize(color);
	const parsed = tokens ? parseModernSyntax(tokens, true) : void 0;
	let result = void 0;
	let i = 0;
	let len = parsers.length;
	while (i < len) if ((result = parsers[i++](color, parsed)) !== void 0) return result;
	return tokens ? parseColorSyntax(tokens) : void 0;
};
//#endregion
//#region ../../node_modules/culori/src/rgb/parseRgb.js
function parseRgb(color, parsed) {
	if (!parsed || parsed[0] !== "rgb" && parsed[0] !== "rgba") return;
	const res = { mode: "rgb" };
	const [, r, g, b, alpha] = parsed;
	if (r.type === Tok.Hue || g.type === Tok.Hue || b.type === Tok.Hue) return;
	if (r.type !== Tok.None) res.r = r.type === Tok.Number ? r.value / 255 : r.value / 100;
	if (g.type !== Tok.None) res.g = g.type === Tok.Number ? g.value / 255 : g.value / 100;
	if (b.type !== Tok.None) res.b = b.type === Tok.Number ? b.value / 255 : b.value / 100;
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/rgb/parseTransparent.js
const parseTransparent = (c) => c === "transparent" ? {
	mode: "rgb",
	r: 0,
	g: 0,
	b: 0,
	alpha: 0
} : void 0;
//#endregion
//#region ../../node_modules/culori/src/interpolate/lerp.js
const lerp = (a, b, t) => a + t * (b - a);
//#endregion
//#region ../../node_modules/culori/src/interpolate/piecewise.js
const get_classes = (arr) => {
	let classes = [];
	for (let i = 0; i < arr.length - 1; i++) {
		let a = arr[i];
		let b = arr[i + 1];
		if (a === void 0 && b === void 0) classes.push(void 0);
		else if (a !== void 0 && b !== void 0) classes.push([a, b]);
		else classes.push(a !== void 0 ? [a, a] : [b, b]);
	}
	return classes;
};
const interpolatorPiecewise = (interpolator) => (arr) => {
	let classes = get_classes(arr);
	return (t) => {
		let cls = t * classes.length;
		let idx = t >= 1 ? classes.length - 1 : Math.max(Math.floor(cls), 0);
		let pair = classes[idx];
		return pair === void 0 ? void 0 : interpolator(pair[0], pair[1], cls - idx);
	};
};
//#endregion
//#region ../../node_modules/culori/src/interpolate/linear.js
const interpolatorLinear = interpolatorPiecewise(lerp);
//#endregion
//#region ../../node_modules/culori/src/fixup/alpha.js
const fixupAlpha = (arr) => {
	let some_defined = false;
	let res = arr.map((v) => {
		if (v !== void 0) {
			some_defined = true;
			return v;
		}
		return 1;
	});
	return some_defined ? res : arr;
};
//#endregion
//#region ../../node_modules/culori/src/rgb/definition.js
const definition$27 = {
	mode: "rgb",
	channels: [
		"r",
		"g",
		"b",
		"alpha"
	],
	parse: [
		parseRgb,
		parseHex,
		parseRgbLegacy,
		parseNamed,
		parseTransparent,
		"srgb"
	],
	serialize: "srgb",
	interpolate: {
		r: interpolatorLinear,
		g: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	gamut: true,
	white: {
		r: 1,
		g: 1,
		b: 1
	},
	black: {
		r: 0,
		g: 0,
		b: 0
	}
};
//#endregion
//#region ../../node_modules/culori/src/a98/convertA98ToXyz65.js
const linearize$2 = (v = 0) => Math.pow(Math.abs(v), 563 / 256) * Math.sign(v);
const convertA98ToXyz65 = (a98) => {
	let r = linearize$2(a98.r);
	let g = linearize$2(a98.g);
	let b = linearize$2(a98.b);
	let res = {
		mode: "xyz65",
		x: .5766690429101305 * r + .1855582379065463 * g + .1882286462349947 * b,
		y: .297344975250536 * r + .6273635662554661 * g + .0752914584939979 * b,
		z: .0270313613864123 * r + .0706888525358272 * g + .9913375368376386 * b
	};
	if (a98.alpha !== void 0) res.alpha = a98.alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/a98/convertXyz65ToA98.js
const gamma$2 = (v) => Math.pow(Math.abs(v), 256 / 563) * Math.sign(v);
const convertXyz65ToA98 = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "a98",
		r: gamma$2(x * 2.0415879038107465 - y * .5650069742788597 - .3447313507783297 * z),
		g: gamma$2(x * -.9692436362808798 + y * 1.8759675015077206 + .0415550574071756 * z),
		b: gamma$2(x * .0134442806320312 - y * .1183623922310184 + 1.0151749943912058 * z)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lrgb/convertRgbToLrgb.js
const fn$3 = (c = 0) => {
	const abs = Math.abs(c);
	if (abs <= .04045) return c / 12.92;
	return (Math.sign(c) || 1) * Math.pow((abs + .055) / 1.055, 2.4);
};
const convertRgbToLrgb = ({ r, g, b, alpha }) => {
	let res = {
		mode: "lrgb",
		r: fn$3(r),
		g: fn$3(g),
		b: fn$3(b)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/convertRgbToXyz65.js
const convertRgbToXyz65 = (rgb) => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: "xyz65",
		x: .4123907992659593 * r + .357584339383878 * g + .1804807884018343 * b,
		y: .2126390058715102 * r + .715168678767756 * g + .0721923153607337 * b,
		z: .0193308187155918 * r + .119194779794626 * g + .9505321522496607 * b
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lrgb/convertLrgbToRgb.js
const fn$2 = (c = 0) => {
	const abs = Math.abs(c);
	if (abs > .0031308) return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - .055);
	return c * 12.92;
};
const convertLrgbToRgb = ({ r, g, b, alpha }, mode = "rgb") => {
	let res = {
		mode,
		r: fn$2(r),
		g: fn$2(g),
		b: fn$2(b)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/convertXyz65ToRgb.js
const convertXyz65ToRgb = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = convertLrgbToRgb({
		r: x * 3.2409699419045226 - y * 1.537383177570094 - .4986107602930034 * z,
		g: x * -.9692436362808796 + y * 1.8759675015077204 + .0415550574071756 * z,
		b: x * .0556300796969936 - y * .2039769588889765 + 1.0569715142428784 * z
	});
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/a98/definition.js
const definition$26 = {
	...definition$27,
	mode: "a98",
	parse: ["a98-rgb"],
	serialize: "a98-rgb",
	fromMode: {
		rgb: (color) => convertXyz65ToA98(convertRgbToXyz65(color)),
		xyz65: convertXyz65ToA98
	},
	toMode: {
		rgb: (color) => convertXyz65ToRgb(convertA98ToXyz65(color)),
		xyz65: convertA98ToXyz65
	}
};
//#endregion
//#region ../../node_modules/culori/src/util/normalizeHue.js
const normalizeHue = (hue) => (hue = hue % 360) < 0 ? hue + 360 : hue;
//#endregion
//#region ../../node_modules/culori/src/fixup/hue.js
const hue = (hues, fn) => {
	return hues.map((hue, idx, arr) => {
		if (hue === void 0) return hue;
		let normalized = normalizeHue(hue);
		if (idx === 0 || hues[idx - 1] === void 0) return normalized;
		return fn(normalized - normalizeHue(arr[idx - 1]));
	}).reduce((acc, curr) => {
		if (!acc.length || curr === void 0 || acc[acc.length - 1] === void 0) {
			acc.push(curr);
			return acc;
		}
		acc.push(curr + acc[acc.length - 1]);
		return acc;
	}, []);
};
const fixupHueShorter = (arr) => hue(arr, (d) => Math.abs(d) <= 180 ? d : d - 360 * Math.sign(d));
//#endregion
//#region ../../node_modules/culori/src/cubehelix/constants.js
const M = [
	-.14861,
	1.78277,
	-.29227,
	-.90649,
	1.97294,
	0
];
const degToRad = Math.PI / 180;
const radToDeg = 180 / Math.PI;
//#endregion
//#region ../../node_modules/culori/src/cubehelix/convertRgbToCubehelix.js
let DE = M[3] * M[4];
let BE = M[1] * M[4];
let BCAD = M[1] * M[2] - M[0] * M[3];
const convertRgbToCubehelix = ({ r, g, b, alpha }) => {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let l = (BCAD * b + r * DE - g * BE) / (BCAD + DE - BE);
	let x = b - l;
	let y = (M[4] * (g - l) - M[2] * x) / M[3];
	let res = {
		mode: "cubehelix",
		l,
		s: l === 0 || l === 1 ? void 0 : Math.sqrt(x * x + y * y) / (M[4] * l * (1 - l))
	};
	if (res.s) res.h = Math.atan2(y, x) * radToDeg - 120;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/cubehelix/convertCubehelixToRgb.js
const convertCubehelixToRgb = ({ h, s, l, alpha }) => {
	let res = { mode: "rgb" };
	h = (h === void 0 ? 0 : h + 120) * degToRad;
	if (l === void 0) l = 0;
	let amp = s === void 0 ? 0 : s * l * (1 - l);
	let cosh = Math.cos(h);
	let sinh = Math.sin(h);
	res.r = l + amp * (M[0] * cosh + M[1] * sinh);
	res.g = l + amp * (M[2] * cosh + M[3] * sinh);
	res.b = l + amp * (M[4] * cosh + M[5] * sinh);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/difference.js
const differenceHueSaturation = (std, smp) => {
	if (std.h === void 0 || smp.h === void 0 || !std.s || !smp.s) return 0;
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	let dH = Math.sin((smp_h - std_h + 360) / 2 * Math.PI / 180);
	return 2 * Math.sqrt(std.s * smp.s) * dH;
};
const differenceHueNaive = (std, smp) => {
	if (std.h === void 0 || smp.h === void 0) return 0;
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	if (Math.abs(smp_h - std_h) > 180) return std_h - (smp_h - 360 * Math.sign(smp_h - std_h));
	return smp_h - std_h;
};
const differenceHueChroma = (std, smp) => {
	if (std.h === void 0 || smp.h === void 0 || !std.c || !smp.c) return 0;
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	let dH = Math.sin((smp_h - std_h + 360) / 2 * Math.PI / 180);
	return 2 * Math.sqrt(std.c * smp.c) * dH;
};
//#endregion
//#region ../../node_modules/culori/src/average.js
const averageAngle = (val) => {
	let sum = val.reduce((sum, val) => {
		if (val !== void 0) {
			let rad = val * Math.PI / 180;
			sum.sin += Math.sin(rad);
			sum.cos += Math.cos(rad);
		}
		return sum;
	}, {
		sin: 0,
		cos: 0
	});
	let angle = Math.atan2(sum.sin, sum.cos) * 180 / Math.PI;
	return angle < 0 ? 360 + angle : angle;
};
//#endregion
//#region ../../node_modules/culori/src/cubehelix/definition.js
const definition$25 = {
	mode: "cubehelix",
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	parse: ["--cubehelix"],
	serialize: "--cubehelix",
	ranges: {
		h: [0, 360],
		s: [0, 4.614],
		l: [0, 1]
	},
	fromMode: { rgb: convertRgbToCubehelix },
	toMode: { rgb: convertCubehelixToRgb },
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		s: interpolatorLinear,
		l: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueSaturation },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/lch/convertLabToLch.js
const convertLabToLch = ({ l, a, b, alpha }, mode = "lch") => {
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let c = Math.sqrt(a * a + b * b);
	let res = {
		mode,
		l,
		c
	};
	if (c) res.h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lch/convertLchToLab.js
const convertLchToLab = ({ l, c, h, alpha }, mode = "lab") => {
	if (h === void 0) h = 0;
	let res = {
		mode,
		l,
		a: c ? c * Math.cos(h / 180 * Math.PI) : 0,
		b: c ? c * Math.sin(h / 180 * Math.PI) : 0
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/constants.js
const k$2 = Math.pow(29, 3) / Math.pow(3, 3);
const e$2 = Math.pow(6, 3) / Math.pow(29, 3);
//#endregion
//#region ../../node_modules/culori/src/constants.js
const D50 = {
	X: .3457 / .3585,
	Y: 1,
	Z: .2958 / .3585
};
const D65 = {
	X: .3127 / .329,
	Y: 1,
	Z: .3583 / .329
};
Math.pow(29, 3) / Math.pow(3, 3);
Math.pow(6, 3) / Math.pow(29, 3);
//#endregion
//#region ../../node_modules/culori/src/lab65/convertLab65ToXyz65.js
let fn$1 = (v) => Math.pow(v, 3) > e$2 ? Math.pow(v, 3) : (116 * v - 16) / k$2;
const convertLab65ToXyz65 = ({ l, a, b, alpha }) => {
	if (l === void 0) l = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let fy = (l + 16) / 116;
	let fx = a / 500 + fy;
	let fz = fy - b / 200;
	let res = {
		mode: "xyz65",
		x: fn$1(fx) * D65.X,
		y: fn$1(fy) * D65.Y,
		z: fn$1(fz) * D65.Z
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab65/convertLab65ToRgb.js
const convertLab65ToRgb = (lab) => convertXyz65ToRgb(convertLab65ToXyz65(lab));
//#endregion
//#region ../../node_modules/culori/src/lab65/convertXyz65ToLab65.js
const f$1 = (value) => value > e$2 ? Math.cbrt(value) : (k$2 * value + 16) / 116;
const convertXyz65ToLab65 = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let f0 = f$1(x / D65.X);
	let f1 = f$1(y / D65.Y);
	let f2 = f$1(z / D65.Z);
	let res = {
		mode: "lab65",
		l: 116 * f1 - 16,
		a: 500 * (f0 - f1),
		b: 200 * (f1 - f2)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab65/convertRgbToLab65.js
const convertRgbToLab65 = (rgb) => {
	let res = convertXyz65ToLab65(convertRgbToXyz65(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) res.a = res.b = 0;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/dlch/constants.js
const θ = 26 / 180 * Math.PI;
const cosθ = Math.cos(θ);
const sinθ = Math.sin(θ);
const factor = 100 / Math.log(139 / 100);
//#endregion
//#region ../../node_modules/culori/src/dlch/convertDlchToLab65.js
const convertDlchToLab65 = ({ l, c, h, alpha }) => {
	if (l === void 0) l = 0;
	if (c === void 0) c = 0;
	if (h === void 0) h = 0;
	let res = {
		mode: "lab65",
		l: (Math.exp(l * 1 / factor) - 1) / .0039
	};
	let G = (Math.exp(.0435 * c * 1 * 1) - 1) / .075;
	let e = G * Math.cos(h / 180 * Math.PI - θ);
	let f = G * Math.sin(h / 180 * Math.PI - θ);
	res.a = e * cosθ - f / .83 * sinθ;
	res.b = e * sinθ + f / .83 * cosθ;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/dlch/convertLab65ToDlch.js
const convertLab65ToDlch = ({ l, a, b, alpha }) => {
	if (l === void 0) l = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let e = a * cosθ + b * sinθ;
	let f = .83 * (b * cosθ - a * sinθ);
	let G = Math.sqrt(e * e + f * f);
	let res = {
		mode: "dlch",
		l: factor / 1 * Math.log(1 + .0039 * l),
		c: Math.log(1 + .075 * G) / .0435
	};
	if (res.c) res.h = normalizeHue((Math.atan2(f, e) + θ) / Math.PI * 180);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/dlab/definition.js
const convertDlabToLab65 = (c) => convertDlchToLab65(convertLabToLch(c, "dlch"));
const convertLab65ToDlab = (c) => convertLchToLab(convertLab65ToDlch(c), "dlab");
const definition$24 = {
	mode: "dlab",
	parse: ["--din99o-lab"],
	serialize: "--din99o-lab",
	toMode: {
		lab65: convertDlabToLab65,
		rgb: (c) => convertLab65ToRgb(convertDlabToLab65(c))
	},
	fromMode: {
		lab65: convertLab65ToDlab,
		rgb: (c) => convertLab65ToDlab(convertRgbToLab65(c))
	},
	channels: [
		"l",
		"a",
		"b",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		a: [-40.09, 45.501],
		b: [-40.469, 44.344]
	},
	interpolate: {
		l: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/dlch/definition.js
const definition$23 = {
	mode: "dlch",
	parse: ["--din99o-lch"],
	serialize: "--din99o-lch",
	toMode: {
		lab65: convertDlchToLab65,
		dlab: (c) => convertLchToLab(c, "dlab"),
		rgb: (c) => convertLab65ToRgb(convertDlchToLab65(c))
	},
	fromMode: {
		lab65: convertLab65ToDlch,
		dlab: (c) => convertLabToLch(c, "dlch"),
		rgb: (c) => convertLab65ToDlch(convertRgbToLab65(c))
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		c: [0, 51.484],
		h: [0, 360]
	},
	interpolate: {
		l: interpolatorLinear,
		c: interpolatorLinear,
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueChroma },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hsi/convertHsiToRgb.js
function convertHsiToRgb({ h, s, i, alpha }) {
	h = normalizeHue(h !== void 0 ? h : 0);
	if (s === void 0) s = 0;
	if (i === void 0) i = 0;
	let f = Math.abs(h / 60 % 2 - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = {
				r: i * (1 + s * (3 / (2 - f) - 1)),
				g: i * (1 + s * (3 * (1 - f) / (2 - f) - 1)),
				b: i * (1 - s)
			};
			break;
		case 1:
			res = {
				r: i * (1 + s * (3 * (1 - f) / (2 - f) - 1)),
				g: i * (1 + s * (3 / (2 - f) - 1)),
				b: i * (1 - s)
			};
			break;
		case 2:
			res = {
				r: i * (1 - s),
				g: i * (1 + s * (3 / (2 - f) - 1)),
				b: i * (1 + s * (3 * (1 - f) / (2 - f) - 1))
			};
			break;
		case 3:
			res = {
				r: i * (1 - s),
				g: i * (1 + s * (3 * (1 - f) / (2 - f) - 1)),
				b: i * (1 + s * (3 / (2 - f) - 1))
			};
			break;
		case 4:
			res = {
				r: i * (1 + s * (3 * (1 - f) / (2 - f) - 1)),
				g: i * (1 - s),
				b: i * (1 + s * (3 / (2 - f) - 1))
			};
			break;
		case 5:
			res = {
				r: i * (1 + s * (3 / (2 - f) - 1)),
				g: i * (1 - s),
				b: i * (1 + s * (3 * (1 - f) / (2 - f) - 1))
			};
			break;
		default: res = {
			r: i * (1 - s),
			g: i * (1 - s),
			b: i * (1 - s)
		};
	}
	res.mode = "rgb";
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsi/convertRgbToHsi.js
function convertRgbToHsi({ r, g, b, alpha }) {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let M = Math.max(r, g, b), m = Math.min(r, g, b);
	let res = {
		mode: "hsi",
		s: r + g + b === 0 ? 0 : 1 - 3 * m / (r + g + b),
		i: (r + g + b) / 3
	};
	if (M - m !== 0) res.h = (M === r ? (g - b) / (M - m) + (g < b) * 6 : M === g ? (b - r) / (M - m) + 2 : (r - g) / (M - m) + 4) * 60;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsi/definition.js
const definition$22 = {
	mode: "hsi",
	toMode: { rgb: convertHsiToRgb },
	parse: ["--hsi"],
	serialize: "--hsi",
	fromMode: { rgb: convertRgbToHsi },
	channels: [
		"h",
		"s",
		"i",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		s: interpolatorLinear,
		i: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueSaturation },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hsl/convertHslToRgb.js
function convertHslToRgb({ h, s, l, alpha }) {
	h = normalizeHue(h !== void 0 ? h : 0);
	if (s === void 0) s = 0;
	if (l === void 0) l = 0;
	let m1 = l + s * (l < .5 ? l : 1 - l);
	let m2 = m1 - (m1 - l) * 2 * Math.abs(h / 60 % 2 - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = {
				r: m1,
				g: m2,
				b: 2 * l - m1
			};
			break;
		case 1:
			res = {
				r: m2,
				g: m1,
				b: 2 * l - m1
			};
			break;
		case 2:
			res = {
				r: 2 * l - m1,
				g: m1,
				b: m2
			};
			break;
		case 3:
			res = {
				r: 2 * l - m1,
				g: m2,
				b: m1
			};
			break;
		case 4:
			res = {
				r: m2,
				g: 2 * l - m1,
				b: m1
			};
			break;
		case 5:
			res = {
				r: m1,
				g: 2 * l - m1,
				b: m2
			};
			break;
		default: res = {
			r: 2 * l - m1,
			g: 2 * l - m1,
			b: 2 * l - m1
		};
	}
	res.mode = "rgb";
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsl/convertRgbToHsl.js
function convertRgbToHsl({ r, g, b, alpha }) {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let M = Math.max(r, g, b), m = Math.min(r, g, b);
	let res = {
		mode: "hsl",
		s: M === m ? 0 : (M - m) / (1 - Math.abs(M + m - 1)),
		l: .5 * (M + m)
	};
	if (M - m !== 0) res.h = (M === r ? (g - b) / (M - m) + (g < b) * 6 : M === g ? (b - r) / (M - m) + 2 : (r - g) / (M - m) + 4) * 60;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/util/hue.js
const hueToDeg = (val, unit) => {
	switch (unit) {
		case "deg": return +val;
		case "rad": return val / Math.PI * 180;
		case "grad": return val / 10 * 9;
		case "turn": return val * 360;
	}
};
//#endregion
//#region ../../node_modules/culori/src/hsl/parseHslLegacy.js
const hsl_old = new RegExp(`^hsla?\\(\\s*${hue$1}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`);
const parseHslLegacy = (color) => {
	let match = color.match(hsl_old);
	if (!match) return;
	let res = { mode: "hsl" };
	if (match[3] !== void 0) res.h = +match[3];
	else if (match[1] !== void 0 && match[2] !== void 0) res.h = hueToDeg(match[1], match[2]);
	if (match[4] !== void 0) res.s = Math.min(Math.max(0, match[4] / 100), 1);
	if (match[5] !== void 0) res.l = Math.min(Math.max(0, match[5] / 100), 1);
	if (match[6] !== void 0) res.alpha = Math.max(0, Math.min(1, match[6] / 100));
	else if (match[7] !== void 0) res.alpha = Math.max(0, Math.min(1, +match[7]));
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/hsl/parseHsl.js
function parseHsl(color, parsed) {
	if (!parsed || parsed[0] !== "hsl" && parsed[0] !== "hsla") return;
	const res = { mode: "hsl" };
	const [, h, s, l, alpha] = parsed;
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) return;
		res.h = h.value;
	}
	if (s.type !== Tok.None) {
		if (s.type === Tok.Hue) return;
		res.s = s.value / 100;
	}
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) return;
		res.l = l.value / 100;
	}
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsl/definition.js
const definition$21 = {
	mode: "hsl",
	toMode: { rgb: convertHslToRgb },
	fromMode: { rgb: convertRgbToHsl },
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	parse: [parseHsl, parseHslLegacy],
	serialize: (c) => `hsl(${c.h !== void 0 ? c.h : "none"} ${c.s !== void 0 ? c.s * 100 + "%" : "none"} ${c.l !== void 0 ? c.l * 100 + "%" : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		s: interpolatorLinear,
		l: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueSaturation },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hsv/convertHsvToRgb.js
function convertHsvToRgb({ h, s, v, alpha }) {
	h = normalizeHue(h !== void 0 ? h : 0);
	if (s === void 0) s = 0;
	if (v === void 0) v = 0;
	let f = Math.abs(h / 60 % 2 - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = {
				r: v,
				g: v * (1 - s * f),
				b: v * (1 - s)
			};
			break;
		case 1:
			res = {
				r: v * (1 - s * f),
				g: v,
				b: v * (1 - s)
			};
			break;
		case 2:
			res = {
				r: v * (1 - s),
				g: v,
				b: v * (1 - s * f)
			};
			break;
		case 3:
			res = {
				r: v * (1 - s),
				g: v * (1 - s * f),
				b: v
			};
			break;
		case 4:
			res = {
				r: v * (1 - s * f),
				g: v * (1 - s),
				b: v
			};
			break;
		case 5:
			res = {
				r: v,
				g: v * (1 - s),
				b: v * (1 - s * f)
			};
			break;
		default: res = {
			r: v * (1 - s),
			g: v * (1 - s),
			b: v * (1 - s)
		};
	}
	res.mode = "rgb";
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsv/convertRgbToHsv.js
function convertRgbToHsv({ r, g, b, alpha }) {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let M = Math.max(r, g, b), m = Math.min(r, g, b);
	let res = {
		mode: "hsv",
		s: M === 0 ? 0 : 1 - m / M,
		v: M
	};
	if (M - m !== 0) res.h = (M === r ? (g - b) / (M - m) + (g < b) * 6 : M === g ? (b - r) / (M - m) + 2 : (r - g) / (M - m) + 4) * 60;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsv/definition.js
const definition$20 = {
	mode: "hsv",
	toMode: { rgb: convertHsvToRgb },
	parse: ["--hsv"],
	serialize: "--hsv",
	fromMode: { rgb: convertRgbToHsv },
	channels: [
		"h",
		"s",
		"v",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		s: interpolatorLinear,
		v: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueSaturation },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hwb/convertHwbToRgb.js
function convertHwbToRgb({ h, w, b, alpha }) {
	if (w === void 0) w = 0;
	if (b === void 0) b = 0;
	if (w + b > 1) {
		let s = w + b;
		w /= s;
		b /= s;
	}
	return convertHsvToRgb({
		h,
		s: b === 1 ? 1 : 1 - w / (1 - b),
		v: 1 - b,
		alpha
	});
}
//#endregion
//#region ../../node_modules/culori/src/hwb/convertRgbToHwb.js
function convertRgbToHwb(rgba) {
	let hsv = convertRgbToHsv(rgba);
	if (hsv === void 0) return void 0;
	let s = hsv.s !== void 0 ? hsv.s : 0;
	let v = hsv.v !== void 0 ? hsv.v : 0;
	let res = {
		mode: "hwb",
		w: (1 - s) * v,
		b: 1 - v
	};
	if (hsv.h !== void 0) res.h = hsv.h;
	if (hsv.alpha !== void 0) res.alpha = hsv.alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hwb/parseHwb.js
function ParseHwb(color, parsed) {
	if (!parsed || parsed[0] !== "hwb") return;
	const res = { mode: "hwb" };
	const [, h, w, b, alpha] = parsed;
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) return;
		res.h = h.value;
	}
	if (w.type !== Tok.None) {
		if (w.type === Tok.Hue) return;
		res.w = w.value / 100;
	}
	if (b.type !== Tok.None) {
		if (b.type === Tok.Hue) return;
		res.b = b.value / 100;
	}
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hwb/definition.js
const definition$19 = {
	mode: "hwb",
	toMode: { rgb: convertHwbToRgb },
	fromMode: { rgb: convertRgbToHwb },
	channels: [
		"h",
		"w",
		"b",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	parse: [ParseHwb],
	serialize: (c) => `hwb(${c.h !== void 0 ? c.h : "none"} ${c.w !== void 0 ? c.w * 100 + "%" : "none"} ${c.b !== void 0 ? c.b * 100 + "%" : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		w: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueNaive },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hdr/transfer.js
const M1 = .1593017578125;
const M2 = 78.84375;
const C1 = .8359375;
const C2 = 18.8515625;
const C3 = 18.6875;
function transferPqDecode(v) {
	if (v < 0) return 0;
	const c = Math.pow(v, 1 / M2);
	return 1e4 * Math.pow(Math.max(0, c - C1) / (C2 - C3 * c), 1 / M1);
}
function transferPqEncode(v) {
	if (v < 0) return 0;
	const c = Math.pow(v / 1e4, M1);
	return Math.pow((C1 + C2 * c) / (1 + C3 * c), M2);
}
//#endregion
//#region ../../node_modules/culori/src/itp/convertItpToXyz65.js
const toRel = (c) => Math.max(c / 203, 0);
const convertItpToXyz65 = ({ i, t, p, alpha }) => {
	if (i === void 0) i = 0;
	if (t === void 0) t = 0;
	if (p === void 0) p = 0;
	const l = transferPqDecode(i + .008609037037932761 * t + .11102962500302593 * p);
	const m = transferPqDecode(i - .00860903703793275 * t - .11102962500302599 * p);
	const s = transferPqDecode(i + .5600313357106791 * t - .32062717498731885 * p);
	const res = {
		mode: "xyz65",
		x: toRel(2.070152218389422 * l - 1.3263473389671556 * m + .2066510476294051 * s),
		y: toRel(.3647385209748074 * l + .680566024947227 * m - .0453045459220346 * s),
		z: toRel(-.049747207535812 * l - .0492609666966138 * m + 1.1880659249923042 * s)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/itp/convertXyz65ToItp.js
const toAbs = (c = 0) => Math.max(c * 203, 0);
const convertXyz65ToItp = ({ x, y, z, alpha }) => {
	const absX = toAbs(x);
	const absY = toAbs(y);
	const absZ = toAbs(z);
	const l = transferPqEncode(.3592832590121217 * absX + .6976051147779502 * absY - .0358915932320289 * absZ);
	const m = transferPqEncode(-.1920808463704995 * absX + 1.1004767970374323 * absY + .0753748658519118 * absZ);
	const s = transferPqEncode(.0070797844607477 * absX + .0748396662186366 * absY + .8433265453898765 * absZ);
	const res = {
		mode: "itp",
		i: .5 * l + .5 * m,
		t: 1.61376953125 * l - 3.323486328125 * m + 1.709716796875 * s,
		p: 4.378173828125 * l - 4.24560546875 * m - .132568359375 * s
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/itp/definition.js
const definition$18 = {
	mode: "itp",
	channels: [
		"i",
		"t",
		"p",
		"alpha"
	],
	parse: ["--ictcp"],
	serialize: "--ictcp",
	toMode: {
		xyz65: convertItpToXyz65,
		rgb: (color) => convertXyz65ToRgb(convertItpToXyz65(color))
	},
	fromMode: {
		xyz65: convertXyz65ToItp,
		rgb: (color) => convertXyz65ToItp(convertRgbToXyz65(color))
	},
	ranges: {
		i: [0, .581],
		t: [-.369, .272],
		p: [-.164, .331]
	},
	interpolate: {
		i: interpolatorLinear,
		t: interpolatorLinear,
		p: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/jab/convertXyz65ToJab.js
const p$1 = 134.03437499999998;
const d0$1 = 16295499532821565e-27;
const jabPqEncode = (v) => {
	if (v < 0) return 0;
	let vn = Math.pow(v / 1e4, M1);
	return Math.pow((C1 + C2 * vn) / (1 + C3 * vn), p$1);
};
const abs = (v = 0) => Math.max(v * 203, 0);
const convertXyz65ToJab = ({ x, y, z, alpha }) => {
	x = abs(x);
	y = abs(y);
	z = abs(z);
	let xp = 1.15 * x - .15 * z;
	let yp = .66 * y + .34 * x;
	let l = jabPqEncode(.41478972 * xp + .579999 * yp + .014648 * z);
	let m = jabPqEncode(-.20151 * xp + 1.120649 * yp + .0531008 * z);
	let s = jabPqEncode(-.0166008 * xp + .2648 * yp + .6684799 * z);
	let i = (l + m) / 2;
	let res = {
		mode: "jab",
		j: .44 * i / (1 - .56 * i) - d0$1,
		a: 3.524 * l - 4.066708 * m + .542708 * s,
		b: .199076 * l + 1.096799 * m - 1.295875 * s
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jab/convertJabToXyz65.js
const p = 134.03437499999998;
const d0 = 16295499532821565e-27;
const jabPqDecode = (v) => {
	if (v < 0) return 0;
	let vp = Math.pow(v, 1 / p);
	return 1e4 * Math.pow((C1 - vp) / (C3 * vp - C2), 1 / M1);
};
const rel = (v) => v / 203;
const convertJabToXyz65 = ({ j, a, b, alpha }) => {
	if (j === void 0) j = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let i = (j + d0) / (.44 + .56 * (j + d0));
	let l = jabPqDecode(i + .13860504 * a + .058047316 * b);
	let m = jabPqDecode(i - .13860504 * a - .058047316 * b);
	let s = jabPqDecode(i - .096019242 * a - .8118919 * b);
	let res = {
		mode: "xyz65",
		x: rel(1.661373024652174 * l - .914523081304348 * m + .23136208173913045 * s),
		y: rel(-.3250758611844533 * l + 1.571847026732543 * m - .21825383453227928 * s),
		z: rel(-.090982811 * l - .31272829 * m + 1.5227666 * s)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jab/convertRgbToJab.js
const convertRgbToJab = (rgb) => {
	let res = convertXyz65ToJab(convertRgbToXyz65(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) res.a = res.b = 0;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jab/convertJabToRgb.js
const convertJabToRgb = (color) => convertXyz65ToRgb(convertJabToXyz65(color));
//#endregion
//#region ../../node_modules/culori/src/jab/definition.js
const definition$17 = {
	mode: "jab",
	channels: [
		"j",
		"a",
		"b",
		"alpha"
	],
	parse: ["--jzazbz"],
	serialize: "--jzazbz",
	fromMode: {
		rgb: convertRgbToJab,
		xyz65: convertXyz65ToJab
	},
	toMode: {
		rgb: convertJabToRgb,
		xyz65: convertJabToXyz65
	},
	ranges: {
		j: [0, .222],
		a: [-.109, .129],
		b: [-.185, .134]
	},
	interpolate: {
		j: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/jch/convertJabToJch.js
const convertJabToJch = ({ j, a, b, alpha }) => {
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let c = Math.sqrt(a * a + b * b);
	let res = {
		mode: "jch",
		j,
		c
	};
	if (c) res.h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jch/convertJchToJab.js
const convertJchToJab = ({ j, c, h, alpha }) => {
	if (h === void 0) h = 0;
	let res = {
		mode: "jab",
		j,
		a: c ? c * Math.cos(h / 180 * Math.PI) : 0,
		b: c ? c * Math.sin(h / 180 * Math.PI) : 0
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jch/definition.js
const definition$16 = {
	mode: "jch",
	parse: ["--jzczhz"],
	serialize: "--jzczhz",
	toMode: {
		jab: convertJchToJab,
		rgb: (c) => convertJabToRgb(convertJchToJab(c))
	},
	fromMode: {
		rgb: (c) => convertJabToJch(convertRgbToJab(c)),
		jab: convertJabToJch
	},
	channels: [
		"j",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		j: [0, .221],
		c: [0, .19],
		h: [0, 360]
	},
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		c: interpolatorLinear,
		j: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueChroma },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/xyz50/constants.js
const k = Math.pow(29, 3) / Math.pow(3, 3);
const e = Math.pow(6, 3) / Math.pow(29, 3);
//#endregion
//#region ../../node_modules/culori/src/lab/convertLabToXyz50.js
let fn = (v) => Math.pow(v, 3) > e ? Math.pow(v, 3) : (116 * v - 16) / k;
const convertLabToXyz50 = ({ l, a, b, alpha }) => {
	if (l === void 0) l = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let fy = (l + 16) / 116;
	let fx = a / 500 + fy;
	let fz = fy - b / 200;
	let res = {
		mode: "xyz50",
		x: fn(fx) * D50.X,
		y: fn(fy) * D50.Y,
		z: fn(fz) * D50.Z
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz50/convertXyz50ToRgb.js
const convertXyz50ToRgb = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = convertLrgbToRgb({
		r: x * 3.1341359569958707 - y * 1.6173863321612538 - .4906619460083532 * z,
		g: x * -.978795502912089 + y * 1.916254567259524 + .03344273116131949 * z,
		b: x * .07195537988411677 - y * .2289768264158322 + 1.405386058324125 * z
	});
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab/convertLabToRgb.js
const convertLabToRgb = (lab) => convertXyz50ToRgb(convertLabToXyz50(lab));
//#endregion
//#region ../../node_modules/culori/src/xyz50/convertRgbToXyz50.js
const convertRgbToXyz50 = (rgb) => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: "xyz50",
		x: .436065742824811 * r + .3851514688337912 * g + .14307845442264197 * b,
		y: .22249319175623702 * r + .7168870538238823 * g + .06061979053616537 * b,
		z: .013923904500943465 * r + .09708128566574634 * g + .7140993584005155 * b
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab/convertXyz50ToLab.js
const f = (value) => value > e ? Math.cbrt(value) : (k * value + 16) / 116;
const convertXyz50ToLab = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let f0 = f(x / D50.X);
	let f1 = f(y / D50.Y);
	let f2 = f(z / D50.Z);
	let res = {
		mode: "lab",
		l: 116 * f1 - 16,
		a: 500 * (f0 - f1),
		b: 200 * (f1 - f2)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab/convertRgbToLab.js
const convertRgbToLab = (rgb) => {
	let res = convertXyz50ToLab(convertRgbToXyz50(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) res.a = res.b = 0;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab/parseLab.js
function parseLab(color, parsed) {
	if (!parsed || parsed[0] !== "lab") return;
	const res = { mode: "lab" };
	const [, l, a, b, alpha] = parsed;
	if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) return;
	if (l.type !== Tok.None) res.l = Math.min(Math.max(0, l.value), 100);
	if (a.type !== Tok.None) res.a = a.type === Tok.Number ? a.value : a.value * 125 / 100;
	if (b.type !== Tok.None) res.b = b.type === Tok.Number ? b.value : b.value * 125 / 100;
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/lab/definition.js
const definition$15 = {
	mode: "lab",
	toMode: {
		xyz50: convertLabToXyz50,
		rgb: convertLabToRgb
	},
	fromMode: {
		xyz50: convertXyz50ToLab,
		rgb: convertRgbToLab
	},
	channels: [
		"l",
		"a",
		"b",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		a: [-125, 125],
		b: [-125, 125]
	},
	parse: [parseLab],
	serialize: (c) => `lab(${c.l !== void 0 ? c.l : "none"} ${c.a !== void 0 ? c.a : "none"} ${c.b !== void 0 ? c.b : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	interpolate: {
		l: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/lab65/definition.js
const definition$14 = {
	...definition$15,
	mode: "lab65",
	parse: ["--lab-d65"],
	serialize: "--lab-d65",
	toMode: {
		xyz65: convertLab65ToXyz65,
		rgb: convertLab65ToRgb
	},
	fromMode: {
		xyz65: convertXyz65ToLab65,
		rgb: convertRgbToLab65
	},
	ranges: {
		l: [0, 100],
		a: [-125, 125],
		b: [-125, 125]
	}
};
//#endregion
//#region ../../node_modules/culori/src/lch/parseLch.js
function parseLch(color, parsed) {
	if (!parsed || parsed[0] !== "lch") return;
	const res = { mode: "lch" };
	const [, l, c, h, alpha] = parsed;
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) return;
		res.l = Math.min(Math.max(0, l.value), 100);
	}
	if (c.type !== Tok.None) res.c = Math.max(0, c.type === Tok.Number ? c.value : c.value * 150 / 100);
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) return;
		res.h = h.value;
	}
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/lch/definition.js
const definition$13 = {
	mode: "lch",
	toMode: {
		lab: convertLchToLab,
		rgb: (c) => convertLabToRgb(convertLchToLab(c))
	},
	fromMode: {
		rgb: (c) => convertLabToLch(convertRgbToLab(c)),
		lab: convertLabToLch
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		c: [0, 150],
		h: [0, 360]
	},
	parse: [parseLch],
	serialize: (c) => `lch(${c.l !== void 0 ? c.l : "none"} ${c.c !== void 0 ? c.c : "none"} ${c.h !== void 0 ? c.h : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		c: interpolatorLinear,
		l: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueChroma },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/lch65/definition.js
const definition$12 = {
	...definition$13,
	mode: "lch65",
	parse: ["--lch-d65"],
	serialize: "--lch-d65",
	toMode: {
		lab65: (c) => convertLchToLab(c, "lab65"),
		rgb: (c) => convertLab65ToRgb(convertLchToLab(c, "lab65"))
	},
	fromMode: {
		rgb: (c) => convertLabToLch(convertRgbToLab65(c), "lch65"),
		lab65: (c) => convertLabToLch(c, "lch65")
	},
	ranges: {
		l: [0, 100],
		c: [0, 150],
		h: [0, 360]
	}
};
//#endregion
//#region ../../node_modules/culori/src/lchuv/convertLuvToLchuv.js
const convertLuvToLchuv = ({ l, u, v, alpha }) => {
	if (u === void 0) u = 0;
	if (v === void 0) v = 0;
	let c = Math.sqrt(u * u + v * v);
	let res = {
		mode: "lchuv",
		l,
		c
	};
	if (c) res.h = normalizeHue(Math.atan2(v, u) * 180 / Math.PI);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lchuv/convertLchuvToLuv.js
const convertLchuvToLuv = ({ l, c, h, alpha }) => {
	if (h === void 0) h = 0;
	let res = {
		mode: "luv",
		l,
		u: c ? c * Math.cos(h / 180 * Math.PI) : 0,
		v: c ? c * Math.sin(h / 180 * Math.PI) : 0
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/luv/convertXyz50ToLuv.js
const u_fn$1 = (x, y, z) => 4 * x / (x + 15 * y + 3 * z);
const v_fn$1 = (x, y, z) => 9 * y / (x + 15 * y + 3 * z);
const un$1 = u_fn$1(D50.X, D50.Y, D50.Z);
const vn$1 = v_fn$1(D50.X, D50.Y, D50.Z);
const l_fn = (value) => value <= e ? k * value : 116 * Math.cbrt(value) - 16;
const convertXyz50ToLuv = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let l = l_fn(y / D50.Y);
	let u = u_fn$1(x, y, z);
	let v = v_fn$1(x, y, z);
	if (!isFinite(u) || !isFinite(v)) l = u = v = 0;
	else {
		u = 13 * l * (u - un$1);
		v = 13 * l * (v - vn$1);
	}
	let res = {
		mode: "luv",
		l,
		u,
		v
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/luv/convertLuvToXyz50.js
const u_fn = (x, y, z) => 4 * x / (x + 15 * y + 3 * z);
const v_fn = (x, y, z) => 9 * y / (x + 15 * y + 3 * z);
const un = u_fn(D50.X, D50.Y, D50.Z);
const vn = v_fn(D50.X, D50.Y, D50.Z);
const convertLuvToXyz50 = ({ l, u, v, alpha }) => {
	if (l === void 0) l = 0;
	if (l === 0) return {
		mode: "xyz50",
		x: 0,
		y: 0,
		z: 0
	};
	if (u === void 0) u = 0;
	if (v === void 0) v = 0;
	let up = u / (13 * l) + un;
	let vp = v / (13 * l) + vn;
	let y = D50.Y * (l <= 8 ? l / k : Math.pow((l + 16) / 116, 3));
	let res = {
		mode: "xyz50",
		x: y * (9 * up) / (4 * vp),
		y,
		z: y * (12 - 3 * up - 20 * vp) / (4 * vp)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lchuv/definition.js
const convertRgbToLchuv = (rgb) => convertLuvToLchuv(convertXyz50ToLuv(convertRgbToXyz50(rgb)));
const convertLchuvToRgb = (lchuv) => convertXyz50ToRgb(convertLuvToXyz50(convertLchuvToLuv(lchuv)));
const definition$11 = {
	mode: "lchuv",
	toMode: {
		luv: convertLchuvToLuv,
		rgb: convertLchuvToRgb
	},
	fromMode: {
		rgb: convertRgbToLchuv,
		luv: convertLuvToLchuv
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	parse: ["--lchuv"],
	serialize: "--lchuv",
	ranges: {
		l: [0, 100],
		c: [0, 176.956],
		h: [0, 360]
	},
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		c: interpolatorLinear,
		l: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueChroma },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/lrgb/definition.js
const definition$10 = {
	...definition$27,
	mode: "lrgb",
	toMode: { rgb: convertLrgbToRgb },
	fromMode: { rgb: convertRgbToLrgb },
	parse: ["srgb-linear"],
	serialize: "srgb-linear"
};
//#endregion
//#region ../../node_modules/culori/src/luv/definition.js
const definition$9 = {
	mode: "luv",
	toMode: {
		xyz50: convertLuvToXyz50,
		rgb: (luv) => convertXyz50ToRgb(convertLuvToXyz50(luv))
	},
	fromMode: {
		xyz50: convertXyz50ToLuv,
		rgb: (rgb) => convertXyz50ToLuv(convertRgbToXyz50(rgb))
	},
	channels: [
		"l",
		"u",
		"v",
		"alpha"
	],
	parse: ["--luv"],
	serialize: "--luv",
	ranges: {
		l: [0, 100],
		u: [-84.936, 175.042],
		v: [-125.882, 87.243]
	},
	interpolate: {
		l: interpolatorLinear,
		u: interpolatorLinear,
		v: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/oklab/convertLrgbToOklab.js
const convertLrgbToOklab = ({ r, g, b, alpha }) => {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let L = Math.cbrt(.412221469470763 * r + .5363325372617348 * g + .0514459932675022 * b);
	let M = Math.cbrt(.2119034958178252 * r + .6806995506452344 * g + .1073969535369406 * b);
	let S = Math.cbrt(.0883024591900564 * r + .2817188391361215 * g + .6299787016738222 * b);
	let res = {
		mode: "oklab",
		l: .210454268309314 * L + .7936177747023054 * M - .0040720430116193 * S,
		a: 1.9779985324311684 * L - 2.42859224204858 * M + .450593709617411 * S,
		b: .0259040424655478 * L + .7827717124575296 * M - .8086757549230774 * S
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/oklab/convertRgbToOklab.js
const convertRgbToOklab = (rgb) => {
	let res = convertLrgbToOklab(convertRgbToLrgb(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) res.a = res.b = 0;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/oklab/convertOklabToLrgb.js
const convertOklabToLrgb = ({ l, a, b, alpha }) => {
	if (l === void 0) l = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let L = Math.pow(l + .3963377773761749 * a + .2158037573099136 * b, 3);
	let M = Math.pow(l - .1055613458156586 * a - .0638541728258133 * b, 3);
	let S = Math.pow(l - .0894841775298119 * a - 1.2914855480194092 * b, 3);
	let res = {
		mode: "lrgb",
		r: 4.076741636075957 * L - 3.3077115392580616 * M + .2309699031821044 * S,
		g: -1.2684379732850317 * L + 2.6097573492876887 * M - .3413193760026573 * S,
		b: -.0041960761386756 * L - .7034186179359362 * M + 1.7076146940746117 * S
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/oklab/convertOklabToRgb.js
const convertOklabToRgb = (c) => convertLrgbToRgb(convertOklabToLrgb(c));
//#endregion
//#region ../../node_modules/culori/src/okhsl/helpers.js
function toe(x) {
	const k_1 = .206;
	const k_2 = .03;
	const k_3 = 1.206 / 1.03;
	return .5 * (k_3 * x - k_1 + Math.sqrt((k_3 * x - k_1) * (k_3 * x - k_1) + 4 * k_2 * k_3 * x));
}
function toe_inv(x) {
	return (x * x + .206 * x) / (1.206 / 1.03 * (x + .03));
}
function compute_max_saturation(a, b) {
	let k0, k1, k2, k3, k4, wl, wm, ws;
	if (-1.88170328 * a - .80936493 * b > 1) {
		k0 = 1.19086277;
		k1 = 1.76576728;
		k2 = .59662641;
		k3 = .75515197;
		k4 = .56771245;
		wl = 4.0767416621;
		wm = -3.3077115913;
		ws = .2309699292;
	} else if (1.81444104 * a - 1.19445276 * b > 1) {
		k0 = .73956515;
		k1 = -.45954404;
		k2 = .08285427;
		k3 = .1254107;
		k4 = .14503204;
		wl = -1.2684380046;
		wm = 2.6097574011;
		ws = -.3413193965;
	} else {
		k0 = 1.35733652;
		k1 = -.00915799;
		k2 = -1.1513021;
		k3 = -.50559606;
		k4 = .00692167;
		wl = -.0041960863;
		wm = -.7034186147;
		ws = 1.707614701;
	}
	let S = k0 + k1 * a + k2 * b + k3 * a * a + k4 * a * b;
	let k_l = .3963377774 * a + .2158037573 * b;
	let k_m = -.1055613458 * a - .0638541728 * b;
	let k_s = -.0894841775 * a - 1.291485548 * b;
	{
		let l_ = 1 + S * k_l;
		let m_ = 1 + S * k_m;
		let s_ = 1 + S * k_s;
		let l = l_ * l_ * l_;
		let m = m_ * m_ * m_;
		let s = s_ * s_ * s_;
		let l_dS = 3 * k_l * l_ * l_;
		let m_dS = 3 * k_m * m_ * m_;
		let s_dS = 3 * k_s * s_ * s_;
		let l_dS2 = 6 * k_l * k_l * l_;
		let m_dS2 = 6 * k_m * k_m * m_;
		let s_dS2 = 6 * k_s * k_s * s_;
		let f = wl * l + wm * m + ws * s;
		let f1 = wl * l_dS + wm * m_dS + ws * s_dS;
		let f2 = wl * l_dS2 + wm * m_dS2 + ws * s_dS2;
		S = S - f * f1 / (f1 * f1 - .5 * f * f2);
	}
	return S;
}
function find_cusp(a, b) {
	let S_cusp = compute_max_saturation(a, b);
	let rgb = convertOklabToLrgb({
		l: 1,
		a: S_cusp * a,
		b: S_cusp * b
	});
	let L_cusp = Math.cbrt(1 / Math.max(rgb.r, rgb.g, rgb.b));
	return [L_cusp, L_cusp * S_cusp];
}
function find_gamut_intersection(a, b, L1, C1, L0, cusp = null) {
	if (!cusp) cusp = find_cusp(a, b);
	let t;
	if ((L1 - L0) * cusp[1] - (cusp[0] - L0) * C1 <= 0) t = cusp[1] * L0 / (C1 * cusp[0] + cusp[1] * (L0 - L1));
	else {
		t = cusp[1] * (L0 - 1) / (C1 * (cusp[0] - 1) + cusp[1] * (L0 - L1));
		{
			let dL = L1 - L0;
			let dC = C1;
			let k_l = .3963377774 * a + .2158037573 * b;
			let k_m = -.1055613458 * a - .0638541728 * b;
			let k_s = -.0894841775 * a - 1.291485548 * b;
			let l_dt = dL + dC * k_l;
			let m_dt = dL + dC * k_m;
			let s_dt = dL + dC * k_s;
			{
				let L = L0 * (1 - t) + t * L1;
				let C = t * C1;
				let l_ = L + C * k_l;
				let m_ = L + C * k_m;
				let s_ = L + C * k_s;
				let l = l_ * l_ * l_;
				let m = m_ * m_ * m_;
				let s = s_ * s_ * s_;
				let ldt = 3 * l_dt * l_ * l_;
				let mdt = 3 * m_dt * m_ * m_;
				let sdt = 3 * s_dt * s_ * s_;
				let ldt2 = 6 * l_dt * l_dt * l_;
				let mdt2 = 6 * m_dt * m_dt * m_;
				let sdt2 = 6 * s_dt * s_dt * s_;
				let r = 4.0767416621 * l - 3.3077115913 * m + .2309699292 * s - 1;
				let r1 = 4.0767416621 * ldt - 3.3077115913 * mdt + .2309699292 * sdt;
				let r2 = 4.0767416621 * ldt2 - 3.3077115913 * mdt2 + .2309699292 * sdt2;
				let u_r = r1 / (r1 * r1 - .5 * r * r2);
				let t_r = -r * u_r;
				let g = -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s - 1;
				let g1 = -1.2684380046 * ldt + 2.6097574011 * mdt - .3413193965 * sdt;
				let g2 = -1.2684380046 * ldt2 + 2.6097574011 * mdt2 - .3413193965 * sdt2;
				let u_g = g1 / (g1 * g1 - .5 * g * g2);
				let t_g = -g * u_g;
				let b = -.0041960863 * l - .7034186147 * m + 1.707614701 * s - 1;
				let b1 = -.0041960863 * ldt - .7034186147 * mdt + 1.707614701 * sdt;
				let b2 = -.0041960863 * ldt2 - .7034186147 * mdt2 + 1.707614701 * sdt2;
				let u_b = b1 / (b1 * b1 - .5 * b * b2);
				let t_b = -b * u_b;
				t_r = u_r >= 0 ? t_r : 1e6;
				t_g = u_g >= 0 ? t_g : 1e6;
				t_b = u_b >= 0 ? t_b : 1e6;
				t += Math.min(t_r, Math.min(t_g, t_b));
			}
		}
	}
	return t;
}
function get_ST_max(a_, b_, cusp = null) {
	if (!cusp) cusp = find_cusp(a_, b_);
	let L = cusp[0];
	let C = cusp[1];
	return [C / L, C / (1 - L)];
}
function get_Cs(L, a_, b_) {
	let cusp = find_cusp(a_, b_);
	let C_max = find_gamut_intersection(a_, b_, L, 1, L, cusp);
	let ST_max = get_ST_max(a_, b_, cusp);
	let S_mid = .11516993 + 1 / (7.4477897 + 4.1590124 * b_ + a_ * (-2.19557347 + 1.75198401 * b_ + a_ * (-2.13704948 - 10.02301043 * b_ + a_ * (-4.24894561 + 5.38770819 * b_ + 4.69891013 * a_))));
	let T_mid = .11239642 + 1 / (1.6132032 - .68124379 * b_ + a_ * (.40370612 + .90148123 * b_ + a_ * (-.27087943 + .6122399 * b_ + a_ * (.00299215 - .45399568 * b_ - .14661872 * a_))));
	let k = C_max / Math.min(L * ST_max[0], (1 - L) * ST_max[1]);
	let C_a = L * S_mid;
	let C_b = (1 - L) * T_mid;
	let C_mid = .9 * k * Math.sqrt(Math.sqrt(1 / (1 / (C_a * C_a * C_a * C_a) + 1 / (C_b * C_b * C_b * C_b))));
	C_a = L * .4;
	C_b = (1 - L) * .8;
	return [
		Math.sqrt(1 / (1 / (C_a * C_a) + 1 / (C_b * C_b))),
		C_mid,
		C_max
	];
}
//#endregion
//#region ../../node_modules/culori/src/okhsl/convertOklabToOkhsl.js
function convertOklabToOkhsl(lab) {
	const l = lab.l !== void 0 ? lab.l : 0;
	const a = lab.a !== void 0 ? lab.a : 0;
	const b = lab.b !== void 0 ? lab.b : 0;
	const ret = {
		mode: "okhsl",
		l: toe(l)
	};
	if (lab.alpha !== void 0) ret.alpha = lab.alpha;
	let c = Math.sqrt(a * a + b * b);
	if (!c) {
		ret.s = 0;
		return ret;
	}
	let [C_0, C_mid, C_max] = get_Cs(l, a / c, b / c);
	let s;
	if (c < C_mid) {
		let k_0 = 0;
		let k_1 = .8 * C_0;
		let k_2 = 1 - k_1 / C_mid;
		s = (c - k_0) / (k_1 + k_2 * (c - k_0)) * .8;
	} else {
		let k_0 = C_mid;
		let k_1 = .2 * C_mid * C_mid * 1.25 * 1.25 / C_0;
		let k_2 = 1 - k_1 / (C_max - C_mid);
		s = .8 + .2 * ((c - k_0) / (k_1 + k_2 * (c - k_0)));
	}
	if (s) {
		ret.s = s;
		ret.h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
	}
	return ret;
}
//#endregion
//#region ../../node_modules/culori/src/okhsl/convertOkhslToOklab.js
function convertOkhslToOklab(hsl) {
	let h = hsl.h !== void 0 ? hsl.h : 0;
	let s = hsl.s !== void 0 ? hsl.s : 0;
	let l = hsl.l !== void 0 ? hsl.l : 0;
	const ret = {
		mode: "oklab",
		l: toe_inv(l)
	};
	if (hsl.alpha !== void 0) ret.alpha = hsl.alpha;
	if (!s || l === 1) {
		ret.a = ret.b = 0;
		return ret;
	}
	let a_ = Math.cos(h / 180 * Math.PI);
	let b_ = Math.sin(h / 180 * Math.PI);
	let [C_0, C_mid, C_max] = get_Cs(ret.l, a_, b_);
	let t, k_0, k_1, k_2;
	if (s < .8) {
		t = 1.25 * s;
		k_0 = 0;
		k_1 = .8 * C_0;
		k_2 = 1 - k_1 / C_mid;
	} else {
		t = 5 * (s - .8);
		k_0 = C_mid;
		k_1 = .2 * C_mid * C_mid * 1.25 * 1.25 / C_0;
		k_2 = 1 - k_1 / (C_max - C_mid);
	}
	let C = k_0 + t * k_1 / (1 - k_2 * t);
	ret.a = C * a_;
	ret.b = C * b_;
	return ret;
}
//#endregion
//#region ../../node_modules/culori/src/okhsl/modeOkhsl.js
const modeOkhsl = {
	...definition$21,
	mode: "okhsl",
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	parse: ["--okhsl"],
	serialize: "--okhsl",
	fromMode: {
		oklab: convertOklabToOkhsl,
		rgb: (c) => convertOklabToOkhsl(convertRgbToOklab(c))
	},
	toMode: {
		oklab: convertOkhslToOklab,
		rgb: (c) => convertOklabToRgb(convertOkhslToOklab(c))
	}
};
//#endregion
//#region ../../node_modules/culori/src/okhsv/convertOklabToOkhsv.js
function convertOklabToOkhsv(lab) {
	let l = lab.l !== void 0 ? lab.l : 0;
	let a = lab.a !== void 0 ? lab.a : 0;
	let b = lab.b !== void 0 ? lab.b : 0;
	let c = Math.sqrt(a * a + b * b);
	let a_ = c ? a / c : 1;
	let b_ = c ? b / c : 1;
	let [S_max, T] = get_ST_max(a_, b_);
	let S_0 = .5;
	let k = 1 - S_0 / S_max;
	let t = T / (c + l * T);
	let L_v = t * l;
	let C_v = t * c;
	let L_vt = toe_inv(L_v);
	let C_vt = C_v * L_vt / L_v;
	let rgb_scale = convertOklabToLrgb({
		l: L_vt,
		a: a_ * C_vt,
		b: b_ * C_vt
	});
	let scale_L = Math.cbrt(1 / Math.max(rgb_scale.r, rgb_scale.g, rgb_scale.b, 0));
	l = l / scale_L;
	c = c / scale_L * toe(l) / l;
	l = toe(l);
	const ret = {
		mode: "okhsv",
		s: c ? (S_0 + T) * C_v / (T * S_0 + T * k * C_v) : 0,
		v: l ? l / L_v : 0
	};
	if (ret.s) ret.h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
	if (lab.alpha !== void 0) ret.alpha = lab.alpha;
	return ret;
}
//#endregion
//#region ../../node_modules/culori/src/okhsv/convertOkhsvToOklab.js
function convertOkhsvToOklab(hsv) {
	const ret = { mode: "oklab" };
	if (hsv.alpha !== void 0) ret.alpha = hsv.alpha;
	const h = hsv.h !== void 0 ? hsv.h : 0;
	const s = hsv.s !== void 0 ? hsv.s : 0;
	const v = hsv.v !== void 0 ? hsv.v : 0;
	const a_ = Math.cos(h / 180 * Math.PI);
	const b_ = Math.sin(h / 180 * Math.PI);
	const [S_max, T] = get_ST_max(a_, b_);
	const S_0 = .5;
	const k = 1 - S_0 / S_max;
	const L_v = 1 - s * S_0 / (S_0 + T - T * k * s);
	const C_v = s * T * S_0 / (S_0 + T - T * k * s);
	const L_vt = toe_inv(L_v);
	const C_vt = C_v * L_vt / L_v;
	const rgb_scale = convertOklabToLrgb({
		l: L_vt,
		a: a_ * C_vt,
		b: b_ * C_vt
	});
	const scale_L = Math.cbrt(1 / Math.max(rgb_scale.r, rgb_scale.g, rgb_scale.b, 0));
	const L_new = toe_inv(v * L_v);
	const C = C_v * L_new / L_v;
	ret.l = L_new * scale_L;
	ret.a = C * a_ * scale_L;
	ret.b = C * b_ * scale_L;
	return ret;
}
//#endregion
//#region ../../node_modules/culori/src/okhsv/modeOkhsv.js
const modeOkhsv = {
	...definition$20,
	mode: "okhsv",
	channels: [
		"h",
		"s",
		"v",
		"alpha"
	],
	parse: ["--okhsv"],
	serialize: "--okhsv",
	fromMode: {
		oklab: convertOklabToOkhsv,
		rgb: (c) => convertOklabToOkhsv(convertRgbToOklab(c))
	},
	toMode: {
		oklab: convertOkhsvToOklab,
		rgb: (c) => convertOklabToRgb(convertOkhsvToOklab(c))
	}
};
//#endregion
//#region ../../node_modules/culori/src/oklab/parseOklab.js
function parseOklab(color, parsed) {
	if (!parsed || parsed[0] !== "oklab") return;
	const res = { mode: "oklab" };
	const [, l, a, b, alpha] = parsed;
	if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) return;
	if (l.type !== Tok.None) res.l = Math.min(Math.max(0, l.type === Tok.Number ? l.value : l.value / 100), 1);
	if (a.type !== Tok.None) res.a = a.type === Tok.Number ? a.value : a.value * .4 / 100;
	if (b.type !== Tok.None) res.b = b.type === Tok.Number ? b.value : b.value * .4 / 100;
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/oklab/definition.js
const definition$8 = {
	...definition$15,
	mode: "oklab",
	toMode: {
		lrgb: convertOklabToLrgb,
		rgb: convertOklabToRgb
	},
	fromMode: {
		lrgb: convertLrgbToOklab,
		rgb: convertRgbToOklab
	},
	ranges: {
		l: [0, 1],
		a: [-.4, .4],
		b: [-.4, .4]
	},
	parse: [parseOklab],
	serialize: (c) => `oklab(${c.l !== void 0 ? c.l : "none"} ${c.a !== void 0 ? c.a : "none"} ${c.b !== void 0 ? c.b : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`
};
//#endregion
//#region ../../node_modules/culori/src/oklch/parseOklch.js
function parseOklch(color, parsed) {
	if (!parsed || parsed[0] !== "oklch") return;
	const res = { mode: "oklch" };
	const [, l, c, h, alpha] = parsed;
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) return;
		res.l = Math.min(Math.max(0, l.type === Tok.Number ? l.value : l.value / 100), 1);
	}
	if (c.type !== Tok.None) res.c = Math.max(0, c.type === Tok.Number ? c.value : c.value * .4 / 100);
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) return;
		res.h = h.value;
	}
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/oklch/definition.js
const definition$7 = {
	...definition$13,
	mode: "oklch",
	toMode: {
		oklab: (c) => convertLchToLab(c, "oklab"),
		rgb: (c) => convertOklabToRgb(convertLchToLab(c, "oklab"))
	},
	fromMode: {
		rgb: (c) => convertLabToLch(convertRgbToOklab(c), "oklch"),
		oklab: (c) => convertLabToLch(c, "oklch")
	},
	parse: [parseOklch],
	serialize: (c) => `oklch(${c.l !== void 0 ? c.l : "none"} ${c.c !== void 0 ? c.c : "none"} ${c.h !== void 0 ? c.h : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	ranges: {
		l: [0, 1],
		c: [0, .4],
		h: [0, 360]
	}
};
//#endregion
//#region ../../node_modules/culori/src/p3/convertP3ToXyz65.js
const convertP3ToXyz65 = (rgb) => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: "xyz65",
		x: .486570948648216 * r + .265667693169093 * g + .1982172852343625 * b,
		y: .2289745640697487 * r + .6917385218365062 * g + .079286914093745 * b,
		z: 0 * r + .0451133818589026 * g + 1.043944368900976 * b
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/p3/convertXyz65ToP3.js
const convertXyz65ToP3 = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = convertLrgbToRgb({
		r: x * 2.4934969119414263 - y * .9313836179191242 - .402710784450717 * z,
		g: x * -.8294889695615749 + y * 1.7626640603183465 + .0236246858419436 * z,
		b: x * .0358458302437845 - y * .0761723892680418 + .9568845240076871 * z
	}, "p3");
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/p3/definition.js
const definition$6 = {
	...definition$27,
	mode: "p3",
	parse: ["display-p3"],
	serialize: "display-p3",
	fromMode: {
		rgb: (color) => convertXyz65ToP3(convertRgbToXyz65(color)),
		xyz65: convertXyz65ToP3
	},
	toMode: {
		rgb: (color) => convertXyz65ToRgb(convertP3ToXyz65(color)),
		xyz65: convertP3ToXyz65
	}
};
//#endregion
//#region ../../node_modules/culori/src/prophoto/convertXyz50ToProphoto.js
const gamma$1 = (v) => {
	let abs = Math.abs(v);
	if (abs >= 1 / 512) return Math.sign(v) * Math.pow(abs, 1 / 1.8);
	return 16 * v;
};
const convertXyz50ToProphoto = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "prophoto",
		r: gamma$1(x * 1.3457868816471585 - y * .2555720873797946 - .0511018649755453 * z),
		g: gamma$1(x * -.5446307051249019 + y * 1.5082477428451466 + .0205274474364214 * z),
		b: gamma$1(x * 0 + y * 0 + 1.2119675456389452 * z)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/prophoto/convertProphotoToXyz50.js
const linearize$1 = (v = 0) => {
	let abs = Math.abs(v);
	if (abs >= 16 / 512) return Math.sign(v) * Math.pow(abs, 1.8);
	return v / 16;
};
const convertProphotoToXyz50 = (prophoto) => {
	let r = linearize$1(prophoto.r);
	let g = linearize$1(prophoto.g);
	let b = linearize$1(prophoto.b);
	let res = {
		mode: "xyz50",
		x: .7977666449006423 * r + .1351812974005331 * g + .0313477341283922 * b,
		y: .2880748288194013 * r + .7118352342418731 * g + 899369387256e-16 * b,
		z: 0 * r + 0 * g + .8251046025104602 * b
	};
	if (prophoto.alpha !== void 0) res.alpha = prophoto.alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/prophoto/definition.js
const definition$5 = {
	...definition$27,
	mode: "prophoto",
	parse: ["prophoto-rgb"],
	serialize: "prophoto-rgb",
	fromMode: {
		xyz50: convertXyz50ToProphoto,
		rgb: (color) => convertXyz50ToProphoto(convertRgbToXyz50(color))
	},
	toMode: {
		xyz50: convertProphotoToXyz50,
		rgb: (color) => convertXyz50ToRgb(convertProphotoToXyz50(color))
	}
};
//#endregion
//#region ../../node_modules/culori/src/rec2020/convertXyz65ToRec2020.js
const α$1 = 1.09929682680944;
const β$1 = .018053968510807;
const gamma = (v) => {
	const abs = Math.abs(v);
	if (abs > β$1) return (Math.sign(v) || 1) * (α$1 * Math.pow(abs, .45) - .09929682680944008);
	return 4.5 * v;
};
const convertXyz65ToRec2020 = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "rec2020",
		r: gamma(x * 1.7166511879712683 - y * .3556707837763925 - .2533662813736599 * z),
		g: gamma(x * -.6666843518324893 + y * 1.6164812366349395 + .0157685458139111 * z),
		b: gamma(x * .0176398574453108 - y * .0427706132578085 + .9421031212354739 * z)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/rec2020/convertRec2020ToXyz65.js
const α = 1.09929682680944;
const β = .018053968510807;
const linearize = (v = 0) => {
	let abs = Math.abs(v);
	if (abs < β * 4.5) return v / 4.5;
	return (Math.sign(v) || 1) * Math.pow((abs + α - 1) / α, 1 / .45);
};
const convertRec2020ToXyz65 = (rec2020) => {
	let r = linearize(rec2020.r);
	let g = linearize(rec2020.g);
	let b = linearize(rec2020.b);
	let res = {
		mode: "xyz65",
		x: .6369580483012911 * r + .1446169035862083 * g + .1688809751641721 * b,
		y: .262700212011267 * r + .6779980715188708 * g + .059301716469862 * b,
		z: 0 * r + .0280726930490874 * g + 1.0609850577107909 * b
	};
	if (rec2020.alpha !== void 0) res.alpha = rec2020.alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/rec2020/definition.js
const definition$4 = {
	...definition$27,
	mode: "rec2020",
	fromMode: {
		xyz65: convertXyz65ToRec2020,
		rgb: (color) => convertXyz65ToRec2020(convertRgbToXyz65(color))
	},
	toMode: {
		xyz65: convertRec2020ToXyz65,
		rgb: (color) => convertXyz65ToRgb(convertRec2020ToXyz65(color))
	},
	parse: ["rec2020"],
	serialize: "rec2020"
};
//#endregion
//#region ../../node_modules/culori/src/xyb/constants.js
const bias = .0037930732552754493;
const bias_cbrt = Math.cbrt(bias);
//#endregion
//#region ../../node_modules/culori/src/xyb/convertRgbToXyb.js
const transfer$1 = (v) => Math.cbrt(v) - bias_cbrt;
const convertRgbToXyb = (color) => {
	const { r, g, b, alpha } = convertRgbToLrgb(color);
	const l = transfer$1(.3 * r + .622 * g + .078 * b + bias);
	const m = transfer$1(.23 * r + .692 * g + .078 * b + bias);
	const s = transfer$1(.2434226892454782 * r + .2047674442449682 * g + .5518098665095535 * b + bias);
	const res = {
		mode: "xyb",
		x: (l - m) / 2,
		y: (l + m) / 2,
		b: s - (l + m) / 2
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyb/convertXybToRgb.js
const transfer = (v) => Math.pow(v + bias_cbrt, 3);
const convertXybToRgb = ({ x, y, b, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (b === void 0) b = 0;
	const l = transfer(x + y) - bias;
	const m = transfer(y - x) - bias;
	const s = transfer(b + y) - bias;
	const res = convertLrgbToRgb({
		r: 11.031566904639861 * l - 9.866943908131562 * m - .16462299650829934 * s,
		g: -3.2541473810744237 * l + 4.418770377582723 * m - .16462299650829934 * s,
		b: -3.6588512867136815 * l + 2.7129230459360922 * m + 1.9459282407775895 * s
	});
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyb/definition.js
const definition$3 = {
	mode: "xyb",
	channels: [
		"x",
		"y",
		"b",
		"alpha"
	],
	parse: ["--xyb"],
	serialize: "--xyb",
	toMode: { rgb: convertXybToRgb },
	fromMode: { rgb: convertRgbToXyb },
	ranges: {
		x: [-.0154, .0281],
		y: [0, .8453],
		b: [-.2778, .388]
	},
	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/xyz50/definition.js
const definition$2 = {
	mode: "xyz50",
	parse: ["xyz-d50"],
	serialize: "xyz-d50",
	toMode: {
		rgb: convertXyz50ToRgb,
		lab: convertXyz50ToLab
	},
	fromMode: {
		rgb: convertRgbToXyz50,
		lab: convertLabToXyz50
	},
	channels: [
		"x",
		"y",
		"z",
		"alpha"
	],
	ranges: {
		x: [0, .964],
		y: [0, .999],
		z: [0, .825]
	},
	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		z: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/convertXyz65ToXyz50.js
const convertXyz65ToXyz50 = (xyz65) => {
	let { x, y, z, alpha } = xyz65;
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "xyz50",
		x: 1.0479298208405488 * x + .0229467933410191 * y - .0501922295431356 * z,
		y: .0296278156881593 * x + .990434484573249 * y - .0170738250293851 * z,
		z: -.0092430581525912 * x + .0150551448965779 * y + .7518742899580008 * z
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/convertXyz50ToXyz65.js
const convertXyz50ToXyz65 = (xyz50) => {
	let { x, y, z, alpha } = xyz50;
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "xyz65",
		x: .9554734527042182 * x - .0230985368742614 * y + .0632593086610217 * z,
		y: -.0283697069632081 * x + 1.0099954580058226 * y + .021041398966943 * z,
		z: .0123140016883199 * x - .0205076964334779 * y + 1.3303659366080753 * z
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/definition.js
const definition$1 = {
	mode: "xyz65",
	toMode: {
		rgb: convertXyz65ToRgb,
		xyz50: convertXyz65ToXyz50
	},
	fromMode: {
		rgb: convertRgbToXyz65,
		xyz50: convertXyz50ToXyz65
	},
	ranges: {
		x: [0, .95],
		y: [0, 1],
		z: [0, 1.088]
	},
	channels: [
		"x",
		"y",
		"z",
		"alpha"
	],
	parse: ["xyz", "xyz-d65"],
	serialize: "xyz-d65",
	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		z: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/yiq/convertRgbToYiq.js
const convertRgbToYiq = ({ r, g, b, alpha }) => {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	const res = {
		mode: "yiq",
		y: .29889531 * r + .58662247 * g + .11448223 * b,
		i: .59597799 * r - .2741761 * g - .32180189 * b,
		q: .21147017 * r - .52261711 * g + .31114694 * b
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/yiq/convertYiqToRgb.js
const convertYiqToRgb = ({ y, i, q, alpha }) => {
	if (y === void 0) y = 0;
	if (i === void 0) i = 0;
	if (q === void 0) q = 0;
	const res = {
		mode: "rgb",
		r: y + .95608445 * i + .6208885 * q,
		g: y - .27137664 * i - .6486059 * q,
		b: y - 1.10561724 * i + 1.70250126 * q
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/yiq/definition.js
const definition = {
	mode: "yiq",
	toMode: { rgb: convertYiqToRgb },
	fromMode: { rgb: convertRgbToYiq },
	channels: [
		"y",
		"i",
		"q",
		"alpha"
	],
	parse: ["--yiq"],
	serialize: "--yiq",
	ranges: {
		i: [-.595, .595],
		q: [-.522, .522]
	},
	interpolate: {
		y: interpolatorLinear,
		i: interpolatorLinear,
		q: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
const clamp = (value) => Math.max(0, Math.min(1, value || 0));
const fixup = (value) => Math.round(clamp(value) * 255);
const rgb$1 = converter("rgb");
const serializeHex = (color) => {
	if (color === void 0) return;
	let r = fixup(color.r);
	let g = fixup(color.g);
	let b = fixup(color.b);
	return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};
const formatCss = (c) => {
	const color = prepare(c);
	if (!color) return;
	const def = getMode(color.mode);
	if (!def.serialize || typeof def.serialize === "string") {
		let res = `color(${def.serialize || `--${color.mode}`} `;
		def.channels.forEach((ch, i) => {
			if (ch !== "alpha") res += (i ? " " : "") + (color[ch] !== void 0 ? color[ch] : "none");
		});
		if (color.alpha !== void 0 && color.alpha < 1) res += ` / ${color.alpha}`;
		return res + ")";
	}
	if (typeof def.serialize === "function") return def.serialize(color);
};
const formatHex = (c) => serializeHex(rgb$1(c));
//#endregion
//#region ../../node_modules/culori/src/util/normalizePositions.js
const normalizePositions = (arr) => {
	if (arr[0] === void 0) arr[0] = 0;
	if (arr[arr.length - 1] === void 0) arr[arr.length - 1] = 1;
	let i = 1;
	let j;
	let from_idx;
	let from_pos;
	let inc;
	while (i < arr.length) {
		if (arr[i] === void 0) {
			from_idx = i;
			from_pos = arr[i - 1];
			j = i;
			while (arr[j] === void 0) j++;
			inc = (arr[j] - from_pos) / (j - i + 1);
			while (i < j) {
				arr[i] = from_pos + (i + 1 - from_idx) * inc;
				i++;
			}
		} else if (arr[i] < arr[i - 1]) arr[i] = arr[i - 1];
		i++;
	}
	return arr;
};
//#endregion
//#region ../../node_modules/culori/src/easing/midpoint.js
const midpoint = (H = .5) => (t) => H <= 0 ? 1 : H >= 1 ? 0 : Math.pow(t, Math.log(.5) / Math.log(H));
//#endregion
//#region ../../node_modules/culori/src/interpolate/interpolate.js
const isfn = (o) => typeof o === "function";
const isobj = (o) => o && typeof o === "object";
const isnum = (o) => typeof o === "number";
const interpolate_fn = (colors, mode = "rgb", overrides, premap) => {
	let def = getMode(mode);
	let conv = converter(mode);
	let conv_colors = [];
	let positions = [];
	let fns = {};
	colors.forEach((val) => {
		if (Array.isArray(val)) {
			conv_colors.push(conv(val[0]));
			positions.push(val[1]);
		} else if (isnum(val) || isfn(val)) fns[positions.length] = val;
		else {
			conv_colors.push(conv(val));
			positions.push(void 0);
		}
	});
	normalizePositions(positions);
	let fixed = def.channels.reduce((res, ch) => {
		let ffn;
		if (isobj(overrides) && isobj(overrides[ch]) && overrides[ch].fixup) ffn = overrides[ch].fixup;
		else if (isobj(def.interpolate[ch]) && def.interpolate[ch].fixup) ffn = def.interpolate[ch].fixup;
		else ffn = (v) => v;
		res[ch] = ffn(conv_colors.map((color) => color[ch]));
		return res;
	}, {});
	if (premap) {
		let ccolors = conv_colors.map((color, idx) => {
			return def.channels.reduce((c, ch) => {
				c[ch] = fixed[ch][idx];
				return c;
			}, { mode });
		});
		fixed = def.channels.reduce((res, ch) => {
			res[ch] = ccolors.map((c) => {
				let v = premap(c[ch], ch, c, mode);
				return isNaN(v) ? void 0 : v;
			});
			return res;
		}, {});
	}
	let interpolators = def.channels.reduce((res, ch) => {
		let ifn;
		if (isfn(overrides)) ifn = overrides;
		else if (isobj(overrides) && isfn(overrides[ch])) ifn = overrides[ch];
		else if (isobj(overrides) && isobj(overrides[ch]) && overrides[ch].use) ifn = overrides[ch].use;
		else if (isfn(def.interpolate[ch])) ifn = def.interpolate[ch];
		else if (isobj(def.interpolate[ch])) ifn = def.interpolate[ch].use;
		res[ch] = ifn(fixed[ch]);
		return res;
	}, {});
	let n = conv_colors.length - 1;
	return (t) => {
		t = Math.min(Math.max(0, t), 1);
		if (t <= positions[0]) return conv_colors[0];
		if (t > positions[n]) return conv_colors[n];
		let idx = 0;
		while (positions[idx] < t) idx++;
		let start = positions[idx - 1];
		let delta = positions[idx] - start;
		let P = (t - start) / delta;
		let fn = fns[idx] || fns[0];
		if (fn !== void 0) {
			if (isnum(fn)) fn = midpoint((fn - start) / delta);
			P = fn(P);
		}
		let t0 = (idx - 1 + P) / n;
		return def.channels.reduce((res, channel) => {
			let val = interpolators[channel](t0);
			if (val !== void 0) res[channel] = val;
			return res;
		}, { mode });
	};
};
const interpolate = (colors, mode = "rgb", overrides) => interpolate_fn(colors, mode, overrides);
useMode(definition$26);
useMode(definition$25);
useMode(definition$24);
useMode(definition$23);
useMode(definition$22);
useMode(definition$21);
useMode(definition$20);
useMode(definition$19);
useMode(definition$18);
useMode(definition$17);
useMode(definition$16);
useMode(definition$15);
useMode(definition$14);
useMode(definition$13);
useMode(definition$12);
useMode(definition$11);
useMode(definition$10);
useMode(definition$9);
useMode(modeOkhsl);
useMode(modeOkhsv);
useMode(definition$8);
useMode(definition$7);
useMode(definition$6);
useMode(definition$5);
useMode(definition$4);
useMode(definition$27);
useMode(definition$3);
useMode(definition$2);
useMode(definition$1);
useMode(definition);
//#endregion
//#region ../dsgraph-core/dist/values/context.js
/** Reports a non-standard input: an error in strict mode, a warning plus a flag otherwise. */
function lenient(ctx, code, message, flag = "legacy-syntax") {
	if (ctx.strict) {
		ctx.diag.error(code, message, ctx.loc);
		return false;
	}
	ctx.diag.warn(code, message, ctx.loc);
	ctx.flags.add(flag);
	return true;
}
function invalid(ctx, code, message) {
	ctx.diag.error(code, message, ctx.loc);
	ctx.flags.add("invalid");
}
//#endregion
//#region ../dsgraph-core/dist/values/color.js
const COLOR_SPACES = [
	"srgb",
	"srgb-linear",
	"hsl",
	"hwb",
	"lab",
	"lch",
	"oklab",
	"oklch",
	"display-p3",
	"a98-rgb",
	"prophoto-rgb",
	"rec2020",
	"xyz-d65",
	"xyz-d50"
];
/** DTCG color space → culori mode, channel keys and per-channel scale (DTCG value = culori value × scale). */
const MODES = {
	srgb: {
		mode: "rgb",
		keys: [
			"r",
			"g",
			"b"
		],
		scale: [
			1,
			1,
			1
		]
	},
	"srgb-linear": {
		mode: "lrgb",
		keys: [
			"r",
			"g",
			"b"
		],
		scale: [
			1,
			1,
			1
		]
	},
	hsl: {
		mode: "hsl",
		keys: [
			"h",
			"s",
			"l"
		],
		scale: [
			1,
			100,
			100
		]
	},
	hwb: {
		mode: "hwb",
		keys: [
			"h",
			"w",
			"b"
		],
		scale: [
			1,
			100,
			100
		]
	},
	lab: {
		mode: "lab",
		keys: [
			"l",
			"a",
			"b"
		],
		scale: [
			1,
			1,
			1
		]
	},
	lch: {
		mode: "lch",
		keys: [
			"l",
			"c",
			"h"
		],
		scale: [
			1,
			1,
			1
		]
	},
	oklab: {
		mode: "oklab",
		keys: [
			"l",
			"a",
			"b"
		],
		scale: [
			1,
			1,
			1
		]
	},
	oklch: {
		mode: "oklch",
		keys: [
			"l",
			"c",
			"h"
		],
		scale: [
			1,
			1,
			1
		]
	},
	"display-p3": {
		mode: "p3",
		keys: [
			"r",
			"g",
			"b"
		],
		scale: [
			1,
			1,
			1
		]
	},
	"a98-rgb": {
		mode: "a98",
		keys: [
			"r",
			"g",
			"b"
		],
		scale: [
			1,
			1,
			1
		]
	},
	"prophoto-rgb": {
		mode: "prophoto",
		keys: [
			"r",
			"g",
			"b"
		],
		scale: [
			1,
			1,
			1
		]
	},
	rec2020: {
		mode: "rec2020",
		keys: [
			"r",
			"g",
			"b"
		],
		scale: [
			1,
			1,
			1
		]
	},
	"xyz-d65": {
		mode: "xyz65",
		keys: [
			"x",
			"y",
			"z"
		],
		scale: [
			1,
			1,
			1
		]
	},
	"xyz-d50": {
		mode: "xyz50",
		keys: [
			"x",
			"y",
			"z"
		],
		scale: [
			1,
			1,
			1
		]
	}
};
const SPACE_BY_MODE = new Map(Object.entries(MODES).map(([space, m]) => [m.mode, space]));
function toCulori(c) {
	const m = MODES[c.space];
	const out = {
		mode: m.mode,
		alpha: c.alpha
	};
	m.keys.forEach((k, i) => {
		const v = c.components[i];
		if (v !== null && v !== void 0) out[k] = v / m.scale[i];
	});
	return out;
}
function fromCulori(obj) {
	let space = SPACE_BY_MODE.get(obj.mode);
	let src = obj;
	if (!space) {
		space = "srgb";
		src = converter("rgb")(obj);
	}
	const m = MODES[space];
	const components = m.keys.map((k, i) => typeof src[k] === "number" ? src[k] * m.scale[i] : null);
	const value = {
		space,
		components,
		alpha: typeof src.alpha === "number" ? src.alpha : 1
	};
	if (space === "srgb") value.hex = formatHex(src);
	return value;
}
/** culori's parser, which throws on some non-color input (e.g. `clamp(…)`): undefined instead. */
function parse$1(css) {
	try {
		return parse$2(css);
	} catch {
		return;
	}
}
const toOklabConv = converter("oklab");
const toRgbConv = converter("rgb");
function toOklab(c) {
	const o = toOklabConv(toCulori(c));
	return [
		o.l ?? 0,
		o.a ?? 0,
		o.b ?? 0
	];
}
/** sRGB hex (clamped) for display and hex-mismatch checks. */
function colorToHex(c) {
	return formatHex(toRgbConv(toCulori(c))) ?? "#000000";
}
function isInSrgbGamut(c) {
	const rgb = toRgbConv(toCulori(c));
	return [
		rgb.r,
		rgb.g,
		rgb.b
	].every((v) => v >= -1e-4 && v <= 1.0001);
}
/** ΔE in OKLab, scaled ×100 so that ~1 is a just-noticeable difference. */
function deltaEOK(a, b) {
	const [l1, a1, b1] = toOklab(a);
	const [l2, a2, b2] = toOklab(b);
	return Math.hypot(l1 - l2, a1 - a2, b1 - b2) * 100;
}
/** Parses any CSS Color 4 string into a DTCG 2025.10 color object; undefined if not a color. */
function cssColorToDtcg(css) {
	const parsed = parse$1(css.trim());
	if (!parsed) return void 0;
	return colorToDtcg(fromCulori(parsed));
}
/** A color as a DTCG 2025.10 color object. */
function colorToDtcg(c) {
	const out = {
		colorSpace: c.space,
		components: c.components.map((v) => v === null ? "none" : v)
	};
	if (c.alpha !== 1) out.alpha = c.alpha;
	if (c.hex) out.hex = c.hex;
	return out;
}
/** A CSS string or a DTCG color object as a color, without diagnostics; undefined if neither. */
function looseColor(raw) {
	if (typeof raw === "string") {
		const parsed = parse$1(raw.trim());
		return parsed ? fromCulori(parsed) : void 0;
	}
	if (!isPlainObject(raw) || !Array.isArray(raw.components) || raw.components.length !== 3) return void 0;
	if (!COLOR_SPACES.includes(raw.colorSpace)) return void 0;
	const components = raw.components.map((c) => typeof c === "number" ? c : null);
	const alpha = typeof raw.alpha === "number" ? raw.alpha : 1;
	return {
		space: raw.colorSpace,
		components,
		alpha
	};
}
/** CSS text for a color: hex for opaque sRGB, CSS Color 4 otherwise. */
function colorToCss(c) {
	if (c.space === "srgb" && c.alpha === 1) return colorToHex(c);
	return formatCss(toCulori(c)) ?? colorToHex(c);
}
/**
* A color that references another color and applies its own opacity:
* `{ "components": "{color.brand}", "alpha": 0.5 }`, as Figma variables export it.
* Not DTCG 2025.10: an error in strict mode, a flag otherwise.
*/
function composedColor(raw, ctx) {
	const base = looseColor(raw.components);
	if (!base) return invalid(ctx, "dtcg/invalid-color", "components must be an array of 3 values");
	let alpha = raw.alpha ?? 1;
	if (typeof alpha === "string" && /^\s*\d*\.?\d+%\s*$/.test(alpha)) alpha = Number.parseFloat(alpha) / 100;
	if (typeof alpha !== "number" || alpha < 0 || alpha > 1) return invalid(ctx, "dtcg/invalid-color", "alpha must be a number between 0 and 1");
	if (ctx.strict) {
		ctx.diag.error("dtcg/composed-color", "A color with a referenced base and its own alpha is not DTCG 2025.10", ctx.loc);
		return;
	}
	ctx.flags.add("composed-color");
	const { hex: _hex, ...rest } = base;
	return {
		...rest,
		alpha: base.alpha * alpha
	};
}
function canonicalColor(raw, ctx) {
	if (typeof raw === "string") {
		const parsed = parse$1(raw);
		if (!parsed) return invalid(ctx, "dtcg/invalid-color", `"${raw}" is not a valid color`);
		if (!lenient(ctx, "dtcg/legacy-syntax", `Color "${raw}" is a string; DTCG 2025.10 requires an object`)) return void 0;
		return fromCulori(parsed);
	}
	if (!isPlainObject(raw)) return invalid(ctx, "dtcg/invalid-color", "Color value must be an object");
	if (raw.colorSpace === void 0 && raw.components !== void 0 && !Array.isArray(raw.components)) return composedColor(raw, ctx);
	const space = raw.colorSpace;
	if (typeof space !== "string" || !COLOR_SPACES.includes(space)) return invalid(ctx, "dtcg/invalid-color-space", `Unsupported colorSpace "${String(space)}"`);
	const comps = raw.components;
	if (!Array.isArray(comps) || comps.length !== 3) return invalid(ctx, "dtcg/invalid-color", "components must be an array of 3 values");
	const components = [];
	for (const c of comps) if (c === "none") components.push(null);
	else if (typeof c === "number" && Number.isFinite(c)) components.push(c);
	else return invalid(ctx, "dtcg/invalid-color", "Each component must be a number or \"none\"");
	let alpha = 1;
	if (raw.alpha !== void 0) {
		if (typeof raw.alpha !== "number" || raw.alpha < 0 || raw.alpha > 1) return invalid(ctx, "dtcg/invalid-color", "alpha must be a number between 0 and 1");
		alpha = raw.alpha;
	}
	const value = {
		space,
		components,
		alpha
	};
	if (raw.hex !== void 0) {
		if (typeof raw.hex === "string" && /^#[0-9a-fA-F]{6}$/.test(raw.hex)) value.hex = raw.hex.toLowerCase();
		else ctx.diag.warn("dtcg/invalid-hex", "hex fallback must use 6-digit CSS hex notation", ctx.loc);
	}
	return value;
}
//#endregion
//#region ../dsgraph-core/dist/values/dimension.js
const STANDARD_UNITS = /* @__PURE__ */ new Set(["px", "rem"]);
const LEGACY_DIMENSION = /^\s*(-?(?:\d+\.?\d*|\.\d+))\s*(px|rem|em|%|pt|dp|sp|vw|vh|ch|ex)?\s*$/;
function toPx(d, remBase) {
	if (d.unit === "px") return d.value;
	if (d.unit === "rem") return d.value * remBase;
}
function canonicalDimension(raw, ctx) {
	let value;
	if (isPlainObject(raw)) {
		if (typeof raw.value !== "number" || !Number.isFinite(raw.value) || typeof raw.unit !== "string") return invalid(ctx, "dtcg/invalid-dimension", "Dimension must be { value: number, unit: string }");
		value = {
			value: raw.value,
			unit: raw.unit
		};
	} else if (typeof raw === "string" || typeof raw === "number") {
		const m = LEGACY_DIMENSION.exec(String(raw));
		if (!m) return invalid(ctx, "dtcg/invalid-dimension", `"${String(raw)}" is not a valid dimension`);
		const n = Number(m[1]);
		const unit = m[2] ?? (n === 0 ? "px" : "");
		if (unit === "") return invalid(ctx, "dtcg/invalid-dimension", `Dimension "${String(raw)}" has no unit`);
		if (!lenient(ctx, "dtcg/legacy-syntax", `Dimension "${String(raw)}" must be an object { value, unit }`)) return void 0;
		value = {
			value: n,
			unit
		};
	} else return invalid(ctx, "dtcg/invalid-dimension", "Dimension must be an object");
	if (!STANDARD_UNITS.has(value.unit)) {
		if (ctx.allowNonstandardUnits) {
			ctx.flags.add("nonstandard-unit");
			return value;
		}
		if (!lenient(ctx, "dtcg/invalid-unit", `Unit "${value.unit}" is not allowed; use "px" or "rem"`, "nonstandard-unit")) return void 0;
	}
	return value;
}
//#endregion
//#region ../dsgraph-core/dist/values/canonical.js
const STANDARD_TYPES = /* @__PURE__ */ new Set([
	"color",
	"dimension",
	"fontFamily",
	"fontWeight",
	"duration",
	"cubicBezier",
	"number",
	"strokeStyle",
	"border",
	"transition",
	"shadow",
	"gradient",
	"typography"
]);
/** dsgraph-internal types that are not DTCG types but are expected from some sources (no diagnostic). */
const INTERNAL_TYPES = /* @__PURE__ */ new Set(["css-expression"]);
const FONT_WEIGHTS$1 = {
	thin: 100,
	hairline: 100,
	"extra-light": 200,
	"ultra-light": 200,
	light: 300,
	normal: 400,
	regular: 400,
	book: 400,
	medium: 500,
	"semi-bold": 600,
	"demi-bold": 600,
	bold: 700,
	"extra-bold": 800,
	"ultra-bold": 800,
	black: 900,
	heavy: 900,
	"extra-black": 950,
	"ultra-black": 950
};
const LOOSE_FONT_WEIGHTS = new Map(Object.entries(FONT_WEIGHTS$1).map(([k, v]) => [k.replace(/-/g, ""), v]));
const STROKE_STYLES = /* @__PURE__ */ new Set([
	"solid",
	"dashed",
	"dotted",
	"double",
	"groove",
	"ridge",
	"outset",
	"inset"
]);
const LINE_CAPS = /* @__PURE__ */ new Set([
	"round",
	"butt",
	"square"
]);
/**
* Validates a fully resolved value (no references left) against its type and returns
* the canonical form, or undefined if invalid. Non-standard input is accepted only when not strict.
*/
function canonicalValue(type, raw, ctx) {
	switch (type) {
		case "color": return canonicalColor(raw, ctx);
		case "dimension": return canonicalDimension(raw, ctx);
		case "fontFamily": return fontFamily$1(raw, ctx);
		case "fontWeight": return fontWeight$1(raw, ctx);
		case "duration": return duration$1(raw, ctx);
		case "cubicBezier": return cubicBezier(raw, ctx);
		case "number": return numberValue$1(raw, ctx);
		case "strokeStyle": return strokeStyle(raw, ctx);
		case "border": return composite(raw, ctx, "border", {
			color: "color",
			width: "dimension",
			style: "strokeStyle"
		});
		case "transition": return composite(raw, ctx, "transition", {
			duration: "duration",
			delay: "duration",
			timingFunction: "cubicBezier"
		});
		case "shadow": return shadow(raw, ctx);
		case "gradient": return gradient(raw, ctx);
		case "typography": return typography$1(raw, ctx);
		case "css-expression": return typeof raw === "string" ? raw.trim().replace(/\s+/g, " ") : raw;
		default: return raw;
	}
}
function fontFamily$1(raw, ctx) {
	if (typeof raw === "string") return [raw];
	if (Array.isArray(raw) && raw.length > 0 && raw.every((f) => typeof f === "string")) return raw;
	return invalid(ctx, "dtcg/invalid-font-family", "fontFamily must be a string or an array of strings");
}
function fontWeight$1(raw, ctx) {
	if (typeof raw === "number") {
		if (raw >= 1 && raw <= 1e3) return raw;
		return invalid(ctx, "dtcg/invalid-font-weight", `fontWeight ${raw} is outside [1, 1000]`);
	}
	if (typeof raw === "string") {
		const exact = FONT_WEIGHTS$1[raw];
		if (exact !== void 0) return exact;
		const loose = LOOSE_FONT_WEIGHTS.get(raw.toLowerCase().replace(/[\s_-]/g, ""));
		if (loose !== void 0) {
			if (!lenient(ctx, "dtcg/invalid-font-weight", `fontWeight "${raw}" must be lowercase and hyphenated`)) return void 0;
			return loose;
		}
		if (/^\d+$/.test(raw)) {
			if (!lenient(ctx, "dtcg/legacy-syntax", `fontWeight "${raw}" must be a number`)) return void 0;
			return fontWeight$1(Number(raw), ctx);
		}
	}
	return invalid(ctx, "dtcg/invalid-font-weight", `"${String(raw)}" is not a valid fontWeight`);
}
function duration$1(raw, ctx) {
	if (isPlainObject(raw) && typeof raw.value === "number" && (raw.unit === "ms" || raw.unit === "s")) return {
		value: raw.value,
		unit: raw.unit
	};
	if (typeof raw === "string") {
		const m = /^\s*(-?\d*\.?\d+)\s*(ms|s)\s*$/.exec(raw);
		if (m && lenient(ctx, "dtcg/legacy-syntax", `Duration "${raw}" must be an object { value, unit }`)) return {
			value: Number(m[1]),
			unit: m[2]
		};
	}
	return invalid(ctx, "dtcg/invalid-duration", "Duration must be { value: number, unit: \"ms\" | \"s\" }");
}
const durationMs = (d) => d.unit === "s" ? d.value * 1e3 : d.value;
function cubicBezier(raw, ctx) {
	let arr = raw;
	if (typeof raw === "string") {
		const m = /^\s*cubic-bezier\(([^)]*)\)\s*$/.exec(raw);
		if (m && lenient(ctx, "dtcg/legacy-syntax", `cubicBezier "${raw}" must be an array of 4 numbers`)) arr = m[1].split(",").map((s) => Number(s.trim()));
	}
	if (!Array.isArray(arr) || arr.length !== 4 || !arr.every((n) => typeof n === "number" && Number.isFinite(n))) return invalid(ctx, "dtcg/invalid-cubic-bezier", "cubicBezier must be an array of 4 numbers");
	const [x1, , x2] = arr;
	if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) return invalid(ctx, "dtcg/invalid-cubic-bezier", "cubicBezier x coordinates must be within [0, 1]");
	return arr;
}
function numberValue$1(raw, ctx) {
	if (typeof raw === "number" && Number.isFinite(raw)) return raw;
	if (typeof raw === "string" && raw.trim() !== "" && Number.isFinite(Number(raw))) {
		if (lenient(ctx, "dtcg/legacy-syntax", `Number "${raw}" must be a JSON number`)) return Number(raw);
		return;
	}
	return invalid(ctx, "dtcg/invalid-number", "Value must be a JSON number");
}
function strokeStyle(raw, ctx) {
	if (typeof raw === "string") {
		if (STROKE_STYLES.has(raw)) return raw;
		return invalid(ctx, "dtcg/invalid-stroke-style", `"${raw}" is not a valid strokeStyle`);
	}
	if (isPlainObject(raw) && Array.isArray(raw.dashArray) && typeof raw.lineCap === "string") {
		if (!LINE_CAPS.has(raw.lineCap)) return invalid(ctx, "dtcg/invalid-stroke-style", `lineCap "${raw.lineCap}" must be round, butt or square`);
		const dashArray = [];
		for (const d of raw.dashArray) {
			const v = canonicalDimension(d, ctx);
			if (v === void 0) return void 0;
			dashArray.push(v);
		}
		return {
			dashArray,
			lineCap: raw.lineCap
		};
	}
	return invalid(ctx, "dtcg/invalid-stroke-style", "strokeStyle must be a keyword or { dashArray, lineCap }");
}
function composite(raw, ctx, name, fields) {
	if (!isPlainObject(raw)) return invalid(ctx, `dtcg/invalid-${name}`, `${name} value must be an object`);
	const out = {};
	for (const [field, type] of Object.entries(fields)) {
		if (raw[field] === void 0) return invalid(ctx, `dtcg/invalid-${name}`, `${name} is missing "${field}"`);
		const v = canonicalValue(type, raw[field], ctx);
		if (v === void 0) return void 0;
		out[field] = v;
	}
	for (const key of Object.keys(raw)) if (!(key in fields)) ctx.diag.warn(`dtcg/invalid-${name}`, `Unknown ${name} property "${key}"`, ctx.loc);
	return out;
}
function shadow(raw, ctx) {
	const layers = Array.isArray(raw) ? raw.flat() : [raw];
	const out = [];
	for (const layer of layers) {
		if (!isPlainObject(layer)) return invalid(ctx, "dtcg/invalid-shadow", "Each shadow must be an object");
		const { inset, ...rest } = layer;
		if (rest.spread === void 0 && rest.blur !== void 0) {
			if (!lenient(ctx, "dtcg/shadow-missing-spread", "shadow is missing \"spread\"; read as 0")) return void 0;
			rest.spread = {
				value: 0,
				unit: "px"
			};
		}
		const v = composite(rest, ctx, "shadow", {
			color: "color",
			offsetX: "dimension",
			offsetY: "dimension",
			blur: "dimension",
			spread: "dimension"
		});
		if (v === void 0) return void 0;
		if (inset !== void 0 && typeof inset !== "boolean") return invalid(ctx, "dtcg/invalid-shadow", "inset must be a boolean");
		out.push({
			...v,
			inset: inset === true
		});
	}
	return out;
}
function gradient(raw, ctx) {
	if (!Array.isArray(raw)) return invalid(ctx, "dtcg/invalid-gradient", "gradient must be an array of stops");
	const out = [];
	for (const stop of raw.flat()) {
		if (!isPlainObject(stop)) return invalid(ctx, "dtcg/invalid-gradient", "Each gradient stop must be an object");
		const color = canonicalValue("color", stop.color, ctx);
		const position = canonicalValue("number", stop.position, ctx);
		if (color === void 0 || position === void 0) return void 0;
		out.push({
			color,
			position: Math.min(1, Math.max(0, position))
		});
	}
	return out;
}
function typography$1(raw, ctx) {
	if (!isPlainObject(raw)) return invalid(ctx, "dtcg/invalid-typography", "typography value must be an object");
	const out = {};
	for (const [field, type] of Object.entries({
		fontFamily: "fontFamily",
		fontSize: "dimension",
		fontWeight: "fontWeight",
		letterSpacing: "dimension"
	})) {
		if (raw[field] === void 0) {
			if (!lenient(ctx, "dtcg/typography-missing-field", `typography is missing "${field}"`)) return void 0;
			continue;
		}
		const v = canonicalValue(type, raw[field], ctx);
		if (v === void 0) return void 0;
		out[field] = v;
	}
	const lh = raw.lineHeight;
	if (lh === void 0) {
		if (!lenient(ctx, "dtcg/typography-missing-field", "typography is missing \"lineHeight\"")) return void 0;
	} else if (typeof lh === "number") out.lineHeight = lh;
	else {
		const ratio = legacyLineHeight(lh, out.fontSize);
		if (ratio === void 0) return invalid(ctx, "dtcg/invalid-typography", "lineHeight must be a number (multiplier of fontSize)");
		if (!lenient(ctx, "dtcg/legacy-syntax", "lineHeight must be a unitless multiplier of fontSize")) return void 0;
		out.lineHeight = ratio;
	}
	return out;
}
function legacyLineHeight(lh, fontSize) {
	let value;
	let unit;
	if (isPlainObject(lh) && typeof lh.value === "number" && typeof lh.unit === "string") {
		value = lh.value;
		unit = lh.unit;
	} else if (typeof lh === "string") {
		const m = /^\s*(\d*\.?\d+)\s*(px|rem|%)?\s*$/.exec(lh);
		if (m) {
			value = Number(m[1]);
			unit = m[2];
		}
	}
	if (value === void 0) return void 0;
	if (unit === void 0) return value;
	if (unit === "%") return value / 100;
	if (fontSize && fontSize.unit === unit && fontSize.value !== 0) return value / fontSize.value;
}
//#endregion
//#region ../dsgraph-core/dist/values/compare.js
const DEFAULT_COMPARE = {
	remBase: 16,
	equalDeltaE: .01
};
const EQUAL = { result: "equal" };
const NOTATION = { result: "notation" };
const sameJson = (a, b) => canonicalize(a) === canonicalize(b);
const round$1 = (n, d = 4) => Math.round(n * 10 ** d) / 10 ** d;
const COMPOSITE_FIELDS = {
	border: {
		color: "color",
		width: "dimension",
		style: "strokeStyle"
	},
	transition: {
		duration: "duration",
		delay: "duration",
		timingFunction: "cubicBezier"
	},
	typography: {
		fontFamily: "fontFamily",
		fontSize: "dimension",
		fontWeight: "fontWeight",
		letterSpacing: "dimension",
		lineHeight: "number"
	},
	shadowLayer: {
		color: "color",
		offsetX: "dimension",
		offsetY: "dimension",
		blur: "dimension",
		spread: "dimension",
		inset: "boolean"
	},
	gradientStop: {
		color: "color",
		position: "number"
	}
};
/** Compares two canonical values of the same type. */
function compareValues(type, a, b, opts = DEFAULT_COMPARE) {
	if (a === null || a === void 0 || b === null || b === void 0) return a === b || a == null && b == null ? EQUAL : { result: "changed" };
	switch (type) {
		case "color": return compareColor(a, b, opts);
		case "dimension": return compareDimension(a, b, opts);
		case "duration": {
			const da = a;
			const diff = durationMs(b) - durationMs(da);
			if (Math.abs(diff) > 1e-6) return {
				result: "changed",
				delta: { ms: round$1(diff) }
			};
			return sameJson(a, b) ? EQUAL : NOTATION;
		}
		case "number":
		case "fontWeight": {
			const diff = b - a;
			return Math.abs(diff) < 1e-6 ? EQUAL : {
				result: "changed",
				delta: { by: round$1(diff) }
			};
		}
		case "fontFamily": {
			const norm = (f) => f.map((s) => s.replace(/['"]/g, "").trim().toLowerCase());
			if (sameJson(a, b)) return EQUAL;
			return sameJson(norm(a), norm(b)) ? NOTATION : { result: "changed" };
		}
		case "border":
		case "transition":
		case "typography": return compareFields(a, b, COMPOSITE_FIELDS[type], opts);
		case "shadow": return compareList(a, b, COMPOSITE_FIELDS.shadowLayer, opts, "layers");
		case "gradient": return compareList(a, b, COMPOSITE_FIELDS.gradientStop, opts, "stops");
		default: return sameJson(a, b) ? EQUAL : { result: "changed" };
	}
}
function compareColor(a, b, opts) {
	const dE = deltaEOK(a, b);
	const dAlpha = b.alpha - a.alpha;
	if (dE < opts.equalDeltaE && Math.abs(dAlpha) < .001) return a.space === b.space && sameJson(a.components, b.components) && a.alpha === b.alpha ? EQUAL : NOTATION;
	const delta = { deltaEOK: round$1(dE, 2) };
	if (Math.abs(dAlpha) >= .001) delta.deltaAlpha = round$1(dAlpha, 3);
	return {
		result: "changed",
		delta
	};
}
function compareDimension(a, b, opts) {
	const pa = toPx(a, opts.remBase);
	const pb = toPx(b, opts.remBase);
	if (pa === void 0 || pb === void 0) {
		if (a.unit !== b.unit) return {
			result: "changed",
			delta: { unit: `${a.unit} → ${b.unit}` }
		};
		const diff = b.value - a.value;
		return Math.abs(diff) < 1e-6 ? EQUAL : {
			result: "changed",
			delta: { [a.unit]: round$1(diff) }
		};
	}
	const diff = pb - pa;
	if (Math.abs(diff) < 1e-6) return a.unit === b.unit && a.value === b.value ? EQUAL : NOTATION;
	const delta = { px: round$1(diff) };
	if (pa !== 0) delta.ratio = round$1(diff / pa);
	return {
		result: "changed",
		delta
	};
}
function compareFields(a, b, fields, opts) {
	if (!isPlainObject(a) || !isPlainObject(b)) return sameJson(a, b) ? EQUAL : { result: "changed" };
	const changed = [];
	let notation = false;
	for (const [field, type] of Object.entries(fields)) {
		const r = type === "boolean" ? a[field] === b[field] ? EQUAL : { result: "changed" } : compareValues(type, a[field], b[field], opts);
		if (r.result === "changed") changed.push(field);
		else if (r.result === "notation") notation = true;
	}
	if (changed.length > 0) return {
		result: "changed",
		delta: { fields: changed }
	};
	return notation ? NOTATION : EQUAL;
}
function compareList(a, b, fields, opts, label) {
	if (a.length !== b.length) return {
		result: "changed",
		delta: { [label]: `${a.length} → ${b.length}` }
	};
	let notation = false;
	const changed = [];
	a.forEach((item, i) => {
		const r = compareFields(item, b[i], fields, opts);
		if (r.result === "changed") changed.push(`${i}`);
		else if (r.result === "notation") notation = true;
	});
	if (changed.length > 0) return {
		result: "changed",
		delta: { [label]: changed }
	};
	return notation ? NOTATION : EQUAL;
}
//#endregion
//#region ../dsgraph-core/dist/diff/rename.js
function levenshtein(a, b) {
	if (a === b) return 0;
	let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const cur = [i];
		for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
		prev = cur;
	}
	return prev[b.length];
}
/** Path similarity in [0, 1]: segment overlap, edit distance and same leaf. */
function pathSimilarity(rawA, rawB) {
	const a = normalizeName(rawA) || rawA;
	const b = normalizeName(rawB) || rawB;
	const sa = new Set(a.split("."));
	const sb = new Set(b.split("."));
	const jaccard = [...sa].filter((s) => sb.has(s)).length / (/* @__PURE__ */ new Set([...sa, ...sb])).size;
	const lev = 1 - levenshtein(a, b) / Math.max(a.length, b.length, 1);
	return .5 * jaccard + .3 * lev + .2 * leafSimilarity(a.split(".").at(-1), b.split(".").at(-1));
}
/** 1 for the same leaf; partial credit for abbreviations (`sm` → `small`) and small edits. */
function leafSimilarity(a, b) {
	if (a === b) return 1;
	const prefix = a.startsWith(b) || b.startsWith(a) ? .8 : 0;
	return Math.max(prefix, 1 - levenshtein(a, b) / Math.max(a.length, b.length, 1));
}
const isObj$3 = (v) => v !== null && typeof v === "object";
/**
* An identifier that survives renames: `dev.dsgraph.stableId` (set by adapters, e.g. from a
* token's `uuid`) or a Figma variable id in the token's extensions.
*/
function stableIdOf(t) {
	const e = t.extensions;
	if (!e) return void 0;
	const dev = e["dev.dsgraph"];
	if (isObj$3(dev) && typeof dev.stableId === "string") return dev.stableId;
	const figma = e["com.figma"] ?? e.figma;
	if (isObj$3(figma) && typeof figma.variableId === "string") return figma.variableId;
	const flat = e["com.figma.variableId"];
	return typeof flat === "string" ? flat : void 0;
}
/**
* Detects renames among removed × added tokens (spec section 5.3): explicit hints first, then
* the same stable identifier, then same type + equal values in all compared contexts + similar
* paths, assigned greedily.
*/
function detectRenames(base, head, removed, added, inputs, opts) {
	const renames = [];
	const usedFrom = /* @__PURE__ */ new Set();
	const usedTo = /* @__PURE__ */ new Set();
	const addedSet = new Set(added);
	const removedSet = new Set(removed);
	const explicit = (from, to) => {
		if (!removedSet.has(from) || !addedSet.has(to) || usedFrom.has(from) || usedTo.has(to)) return;
		renames.push({
			from,
			to,
			confidence: 1
		});
		usedFrom.add(from);
		usedTo.add(to);
	};
	for (const [from, to] of Object.entries(opts.hints ?? {})) explicit(from, to);
	for (const to of added) {
		const hint = head.token(to)?.extensions?.["dev.dsgraph"]?.renamedFrom;
		if (typeof hint === "string") explicit(hint, to);
	}
	const removedById = /* @__PURE__ */ new Map();
	for (const from of removed) {
		const id = stableIdOf(base.token(from));
		if (id) removedById.set(id, from);
	}
	for (const to of added) {
		const id = stableIdOf(head.token(to));
		const from = id && removedById.get(id);
		if (from) explicit(from, to);
	}
	const valueCount = /* @__PURE__ */ new Map();
	for (const t of head.snapshot.nodes.tokens) {
		const k = canonicalize(head.entry(t.id)?.value);
		valueCount.set(k, (valueCount.get(k) ?? 0) + 1);
	}
	const sameValues = (b, h) => {
		let compared = 0;
		for (const input of inputs) {
			const bv = base.entry(b.id, input);
			const hv = head.entry(h.id, input);
			if (!bv || !hv) continue;
			compared++;
			if (!(canonicalize(bv.raw) === canonicalize(hv.raw)) && compareValues(b.type, bv.value, hv.value, opts.compare).result === "changed") return false;
		}
		return compared > 0;
	};
	const candidates = [];
	for (const from of removed) {
		if (usedFrom.has(from)) continue;
		const b = base.token(from);
		for (const to of added) {
			if (usedTo.has(to)) continue;
			const h = head.token(to);
			if (b.type !== h.type || !sameValues(b, h)) continue;
			let score = pathSimilarity(from, to);
			if (b.description && b.description === h.description) score += .1;
			if (b.origin.file === h.origin.file) score += .05;
			const common = (valueCount.get(canonicalize(head.entry(to)?.value)) ?? 0) > 2;
			if (score < (common ? .7 : .5)) continue;
			candidates.push({
				from,
				to,
				score
			});
		}
	}
	const ambiguous = /* @__PURE__ */ new Map();
	const byFrom = /* @__PURE__ */ new Map();
	for (const c of candidates) byFrom.set(c.from, [...byFrom.get(c.from) ?? [], c]);
	for (const [from, list] of byFrom) {
		list.sort((a, b) => b.score - a.score);
		if (list.length > 1 && list[0].score - list[1].score < .05) ambiguous.set(from, list.filter((c) => list[0].score - c.score < .05).map((c) => c.to));
	}
	candidates.sort((a, b) => b.score - a.score || a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
	for (const c of candidates) {
		if (usedFrom.has(c.from) || usedTo.has(c.to) || ambiguous.has(c.from)) continue;
		renames.push({
			from: c.from,
			to: c.to,
			confidence: Math.min(1, Math.round(c.score * 100) / 100)
		});
		usedFrom.add(c.from);
		usedTo.add(c.to);
	}
	return {
		renames,
		ambiguous
	};
}
//#endregion
//#region ../dsgraph-core/dist/diff/semver.js
const DEFAULT_POLICY = {
	levels: {
		"token.added": "minor",
		"token.removed": "major",
		"token.renamed": "major",
		"token.value-changed": "minor",
		"token.notation-changed": "none",
		"token.alias-retargeted": "patch",
		"token.type-changed": "major",
		"token.contexts-changed": "minor",
		"token.missing-in-context": "major",
		"token.deprecated": "minor",
		"token.undeprecated": "minor",
		"token.description-changed": "patch",
		"token.extensions-changed": "none",
		"group.extends-changed": "patch",
		"context.added": "minor",
		"context.removed": "major",
		"modifier.added": "minor",
		"modifier.removed": "major"
	},
	imperceptible: {
		deltaE: 1,
		px: .5
	}
};
const LEVEL_RANK = {
	none: 0,
	patch: 1,
	minor: 2,
	major: 3
};
function maxLevel(levels) {
	let best = "none";
	for (const l of levels) if (LEVEL_RANK[l] > LEVEL_RANK[best]) best = l;
	return best;
}
function mergePolicy(p) {
	return {
		levels: {
			...DEFAULT_POLICY.levels,
			...p?.levels
		},
		imperceptible: {
			...DEFAULT_POLICY.imperceptible,
			...p?.imperceptible
		}
	};
}
/**
* Level of one change from the point of view of consumers referencing tokens by name.
* Tokens in non-public layers are capped at `patch`: their effect on consumers shows up
* as propagated changes of public tokens.
*/
function levelOf(change, policy, isPublic) {
	let level = policy.levels[change.kind];
	if (change.kind === "token.value-changed" && change.delta) {
		const d = change.delta;
		const dE = typeof d.deltaEOK === "number" ? d.deltaEOK : void 0;
		const px = typeof d.px === "number" ? d.px : void 0;
		const alphaOk = d.deltaAlpha === void 0 || Math.abs(d.deltaAlpha) < .01;
		if (dE !== void 0 && dE < policy.imperceptible.deltaE && alphaOk || px !== void 0 && Math.abs(px) < policy.imperceptible.px) level = "patch";
	}
	if (!isPublic && change.kind.startsWith("token.") && LEVEL_RANK[level] > LEVEL_RANK.patch) level = "patch";
	return level;
}
//#endregion
//#region ../dsgraph-core/dist/diff/diff.js
/** Compares two snapshots (spec section 5) and classifies every change (section 6). */
async function diff(base, head, opts = {}) {
	const compare = {
		...DEFAULT_COMPARE,
		...opts.compare
	};
	const policy = mergePolicy(opts.semver);
	const drafts = [];
	const draft = (d) => {
		const full = {
			when: null,
			origin: "direct",
			cause: [],
			confidence: 1,
			...d
		};
		drafts.push(full);
		return full;
	};
	const bm = new Map(base.modifiers.map((m) => [m.name, m]));
	const hm = new Map(head.modifiers.map((m) => [m.name, m]));
	for (const name of bm.keys()) if (!hm.has(name)) draft({
		kind: "modifier.removed",
		target: name
	});
	for (const name of hm.keys()) if (!bm.has(name)) draft({
		kind: "modifier.added",
		target: name
	});
	const common = [...bm.keys()].filter((n) => hm.has(n));
	for (const name of common) {
		const bc = bm.get(name).contexts;
		const hc = hm.get(name).contexts;
		for (const c of bc) if (!hc.includes(c)) draft({
			kind: "context.removed",
			target: `${name}:${c}`
		});
		for (const c of hc) if (!bc.includes(c)) draft({
			kind: "context.added",
			target: `${name}:${c}`
		});
	}
	const shared = common.map((name) => ({
		name,
		contexts: bm.get(name).contexts.filter((c) => hm.get(name).contexts.includes(c))
	}));
	const extra = {};
	for (const m of [...base.modifiers, ...head.modifiers]) if (!common.includes(m.name)) extra[m.name] = m.default ?? m.contexts[0];
	const inputs = enumerateInputs(shared).map((i) => ({
		...extra,
		...i
	}));
	const sharedNames = shared.map((m) => m.name);
	const baseIds = new Set(base.snapshot.nodes.tokens.map((t) => t.id));
	const headIds = new Set(head.snapshot.nodes.tokens.map((t) => t.id));
	const removed = [...baseIds].filter((id) => !headIds.has(id)).sort();
	const added = [...headIds].filter((id) => !baseIds.has(id)).sort();
	const { renames, ambiguous } = detectRenames(base, head, removed, added, inputs, {
		hints: opts.renames,
		compare
	});
	const renamedFrom = new Map(renames.map((r) => [r.from, r]));
	const renamedTo = new Set(renames.map((r) => r.to));
	for (const id of removed) {
		if (renamedFrom.has(id)) continue;
		const d = draft({
			kind: "token.removed",
			target: id,
			before: summarize(base.token(id))
		});
		const possible = ambiguous.get(id);
		if (possible) {
			d.possibleRenames = possible;
			d.note = "Several tokens with equal values and similar paths were added; rename not assumed.";
		}
	}
	for (const id of added) if (!renamedTo.has(id)) draft({
		kind: "token.added",
		target: id,
		after: summarize(head.token(id))
	});
	for (const r of renames) draft({
		kind: "token.renamed",
		target: r.to,
		from: r.from,
		confidence: r.confidence
	});
	const pairs = [...[...baseIds].filter((id) => headIds.has(id)).map((id) => [id, id]), ...renames.map((r) => [r.from, r.to])];
	const ignore = /* @__PURE__ */ new Set(["dev.dsgraph", ...opts.ignoreExtensions ?? []]);
	for (const [bid, hid] of pairs.sort((a, b) => a[1].localeCompare(b[1]))) {
		const b = base.token(bid);
		const h = head.token(hid);
		if (b.type !== h.type) draft({
			kind: "token.type-changed",
			target: hid,
			before: b.type,
			after: h.type
		});
		const perInput = [];
		for (const input of inputs) {
			const bv = base.entry(bid, input);
			const hv = head.entry(hid, input);
			if (bv && !hv) {
				perInput.push({
					input,
					sig: "missing",
					d: {
						kind: "token.missing-in-context",
						before: bv.value
					}
				});
				continue;
			}
			if (!bv || !hv) continue;
			const rawSame = canonicalize(bv.raw) === canonicalize(hv.raw);
			const r = b.type === h.type ? compareValues(h.type, bv.value, hv.value, compare) : { result: "changed" };
			let d;
			if (r.result === "changed") {
				d = {
					kind: "token.value-changed",
					origin: rawSame ? "propagated" : "direct",
					before: {
						raw: bv.raw,
						value: bv.value
					},
					after: {
						raw: hv.raw,
						value: hv.value
					}
				};
				if ("delta" in r && r.delta) d.delta = r.delta;
			} else if (!rawSame) d = canonicalize(bv.refs) === canonicalize(hv.refs) ? {
				kind: "token.notation-changed",
				before: { raw: bv.raw },
				after: { raw: hv.raw }
			} : {
				kind: "token.alias-retargeted",
				before: { raw: bv.raw },
				after: { raw: hv.raw }
			};
			if (d) perInput.push({
				input,
				sig: canonicalize(d),
				d
			});
		}
		for (const { when, d } of compressByWhen(perInput, inputs, sharedNames)) draft({
			...d,
			target: hid,
			when
		});
		const bInfl = influencing(b);
		const hInfl = influencing(h);
		if (canonicalize(bInfl) !== canonicalize(hInfl)) draft({
			kind: "token.contexts-changed",
			target: hid,
			before: bInfl,
			after: hInfl
		});
		if (!b.deprecated && h.deprecated) draft({
			kind: "token.deprecated",
			target: hid,
			after: h.deprecated
		});
		if (b.deprecated && !h.deprecated) draft({
			kind: "token.undeprecated",
			target: hid,
			before: b.deprecated
		});
		if ((b.description ?? "") !== (h.description ?? "")) draft({
			kind: "token.description-changed",
			target: hid,
			before: b.description,
			after: h.description
		});
		if (canonicalize(stripExt(b.extensions, ignore)) !== canonicalize(stripExt(h.extensions, ignore))) draft({
			kind: "token.extensions-changed",
			target: hid
		});
	}
	const bg = new Map(base.snapshot.nodes.groups.map((g) => [g.id, g]));
	for (const g of head.snapshot.nodes.groups) {
		const prev = bg.get(g.id);
		if (prev && (prev.extends ?? null) !== (g.extends ?? null)) draft({
			kind: "group.extends-changed",
			target: g.id,
			before: prev.extends,
			after: g.extends
		});
	}
	const directValue = /* @__PURE__ */ new Map();
	for (const d of drafts) if (d.kind === "token.value-changed" && d.origin === "direct") directValue.set(d.target, [...directValue.get(d.target) ?? [], d]);
	const changes = [];
	const idOf = /* @__PURE__ */ new Map();
	for (const d of drafts) idOf.set(d, `chg_${(await sha256Hex(canonicalize({
		k: d.kind,
		t: d.target,
		w: d.when,
		f: d.from
	}))).slice(0, 12)}`);
	for (const d of drafts) {
		if (d.kind === "token.value-changed" && d.origin === "propagated") d.cause = head.dependencies(d.target, { transitive: true }).flatMap((dep) => (directValue.get(dep) ?? []).map((c) => idOf.get(c))).sort();
		const token = d.kind.startsWith("token.") ? head.token(d.target) ?? base.token(d.target) : void 0;
		const isPublic = token?.layer ? opts.layers?.[token.layer]?.public !== false : true;
		changes.push({
			...d,
			id: idOf.get(d),
			level: levelOf(d, policy, isPublic)
		});
	}
	changes.sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level] || a.target.localeCompare(b.target) || a.kind.localeCompare(b.kind) || canonicalize(a.when).localeCompare(canonicalize(b.when)));
	const counts = {
		added: 0,
		removed: 0,
		renamed: 0,
		changed: 0,
		propagated: 0,
		deprecated: 0
	};
	for (const c of changes) if (c.kind === "token.added") counts.added++;
	else if (c.kind === "token.removed") counts.removed++;
	else if (c.kind === "token.renamed") counts.renamed++;
	else if (c.kind === "token.value-changed") c.origin === "direct" ? counts.changed++ : counts.propagated++;
	else if (c.kind === "token.deprecated") counts.deprecated++;
	const level = maxLevel(changes.map((c) => c.level));
	return {
		schema: CHANGESET_SCHEMA,
		base: {
			hash: base.snapshot.hash,
			source: base.snapshot.source
		},
		head: {
			hash: head.snapshot.hash,
			source: head.snapshot.source
		},
		contexts: {
			compared: inputs,
			partial: base.snapshot.contexts.partial || head.snapshot.contexts.partial
		},
		summary: {
			counts,
			level,
			reasons: reasons(changes, level)
		},
		changes,
		diagnostics: []
	};
}
function summarize(t) {
	return {
		type: t.type,
		values: t.values.map((v) => ({
			when: v.when,
			raw: v.raw,
			value: v.value
		}))
	};
}
function influencing(t) {
	const names = /* @__PURE__ */ new Set();
	for (const v of t.values) for (const k of Object.keys(v.when)) names.add(k);
	return [...names].sort();
}
function stripExt(ext, ignore) {
	if (!ext) return {};
	return Object.fromEntries(Object.entries(ext).filter(([k]) => !ignore.has(k)));
}
/**
* Collapses identical per-input changes into the smallest `when` that covers exactly
* the inputs where they occur; falls back to full inputs otherwise.
*/
function compressByWhen(perInput, inputs, names) {
	const groups = /* @__PURE__ */ new Map();
	for (const p of perInput) {
		const g = groups.get(p.sig) ?? {
			d: p.d,
			inputs: []
		};
		g.inputs.push(p.input);
		groups.set(p.sig, g);
	}
	const out = [];
	for (const g of groups.values()) {
		const when = {};
		for (const n of names) {
			const values = new Set(g.inputs.map((i) => i[n]));
			if (values.size === 1) when[n] = [...values][0];
		}
		if (inputs.filter((i) => Object.entries(when).every(([k, v]) => i[k] === v)).length === g.inputs.length) out.push({
			when: Object.keys(when).length ? when : null,
			d: g.d
		});
		else for (const i of g.inputs) out.push({
			when: Object.fromEntries(names.map((n) => [n, i[n]])),
			d: g.d
		});
	}
	return out;
}
const KIND_LABEL = {
	"token.removed": "removed",
	"token.renamed": "renamed",
	"token.type-changed": "changed type",
	"token.missing-in-context": "missing in a context",
	"context.removed": "context removed",
	"modifier.removed": "modifier removed",
	"token.added": "added",
	"token.value-changed": "value changed",
	"token.deprecated": "deprecated",
	"context.added": "context added",
	"modifier.added": "modifier added"
};
function reasons(changes, level) {
	const counts = /* @__PURE__ */ new Map();
	for (const c of changes) {
		if (c.level !== level || level === "none") continue;
		const label = KIND_LABEL[c.kind] ?? c.kind;
		counts.set(label, (counts.get(label) ?? 0) + 1);
	}
	return [...counts].map(([label, n]) => `${n} ${label}`);
}
//#endregion
//#region ../dsgraph-core/dist/dtcg/flatten.js
const GROUP_PROPS = /* @__PURE__ */ new Set([
	"$type",
	"$description",
	"$deprecated",
	"$extends",
	"$extensions"
]);
/** `$`-prefixed keys commonly found at the root of token files; ignored without a diagnostic. */
const IGNORED_PROPS = /* @__PURE__ */ new Set([
	"$schema",
	"$metadata",
	"$themes",
	"$defs"
]);
const TOKEN_PROPS = /* @__PURE__ */ new Set([
	"$value",
	"$type",
	"$description",
	"$deprecated",
	"$extensions",
	"$ref"
]);
const isTokenObject = (o) => Object.hasOwn(o, "$value") || typeof o.$ref === "string";
/** Flattens one DTCG document into tokens and groups keyed by dot path. Does not resolve anything. */
function flattenDocument(tree, file, diag) {
	const doc = {
		tokens: /* @__PURE__ */ new Map(),
		groups: /* @__PURE__ */ new Map()
	};
	if (!isPlainObject(tree)) {
		diag.error("dtcg/invalid-document", "A design token document must be a JSON object", {
			file,
			pointer: ""
		});
		return doc;
	}
	const readGroupProps = (obj, pointer) => {
		const props = {};
		const loc = {
			file,
			pointer
		};
		if (obj.$type !== void 0) {
			if (typeof obj.$type === "string") props.type = obj.$type;
			else diag.error("dtcg/invalid-type-property", "$type must be a string", loc);
		}
		if (obj.$description !== void 0) {
			if (typeof obj.$description === "string") props.description = obj.$description;
			else diag.error("dtcg/invalid-description", "$description must be a string", loc);
		}
		if (obj.$deprecated !== void 0) {
			if (typeof obj.$deprecated === "boolean" || typeof obj.$deprecated === "string") props.deprecated = obj.$deprecated;
			else diag.error("dtcg/invalid-deprecated", "$deprecated must be a boolean or a string", loc);
		}
		if (obj.$extends !== void 0) props.extends = obj.$extends;
		if (obj.$extensions !== void 0) {
			if (isPlainObject(obj.$extensions)) props.extensions = obj.$extensions;
			else diag.error("dtcg/invalid-extensions", "$extensions must be an object", loc);
		}
		return props;
	};
	const addToken = (obj, path, segs) => {
		const pointer = toPointer(segs);
		const loc = {
			file,
			pointer
		};
		const flags = [];
		let node = obj;
		if (!Object.hasOwn(obj, "$value")) {
			node = {
				...obj,
				$value: { $ref: obj.$ref }
			};
			delete node.$ref;
			flags.push("ref-only");
		}
		for (const key of Object.keys(obj)) if (key.startsWith("$")) {
			if (!TOKEN_PROPS.has(key)) diag.info("dtcg/unknown-property", `Unknown token property "${key}"`, loc);
		} else if (isPlainObject(obj[key])) diag.error("dtcg/token-with-children", `Object has both $value and child "${key}"; it cannot be a token and a group at once`, loc);
		if (obj.$type !== void 0 && typeof obj.$type !== "string") diag.error("dtcg/invalid-type-property", "$type must be a string", loc);
		const id = tokenId(path);
		doc.tokens.set(id, {
			id,
			path,
			node,
			origin: {
				file,
				pointer
			},
			inheritedFrom: null,
			flags
		});
	};
	const walk = (obj, path, segs) => {
		const pointer = toPointer(segs);
		doc.groups.set(tokenId(path), {
			id: tokenId(path),
			path,
			props: readGroupProps(obj, pointer),
			origin: {
				file,
				pointer
			}
		});
		for (const key of Object.keys(obj)) {
			const child = obj[key];
			const childSegs = [...segs, key];
			const loc = {
				file,
				pointer: toPointer(childSegs)
			};
			if (key.startsWith("$") && key !== "$root") {
				if (!GROUP_PROPS.has(key) && !IGNORED_PROPS.has(key)) diag.info("dtcg/unknown-property", `Unknown group property "${key}"`, {
					file,
					pointer
				});
				continue;
			}
			if (key !== "$root" && /[{}.]/.test(key)) {
				diag.error("dtcg/invalid-name", `Name "${key}" must not contain "{", "}" or "."`, loc);
				continue;
			}
			if (!isPlainObject(child)) {
				diag.error("dtcg/invalid-node", `"${key}" is neither a token nor a group`, loc);
				continue;
			}
			if (isTokenObject(child)) addToken(child, [...path, key], childSegs);
			else if (key === "$root") diag.error("dtcg/invalid-root-token", "$root must be a token", loc);
			else walk(child, [...path, key], childSegs);
		}
	};
	walk(tree, [], []);
	return doc;
}
//#endregion
//#region ../dsgraph-core/dist/dtcg/merge.js
const isUnder = (id, ancestor) => ancestor === "" || id.startsWith(`${ancestor}.`);
/**
* Merges documents in order (Resolver 2025.10, section 6.2): groups merge deeply,
* a token is replaced as a whole, the last occurrence wins.
*/
function mergeDocs(docs, diag) {
	const tokens = /* @__PURE__ */ new Map();
	const groups = /* @__PURE__ */ new Map();
	const layerOf = /* @__PURE__ */ new Map();
	docs.forEach((doc, layer) => {
		for (const [id, g] of doc.groups) {
			const prev = groups.get(id);
			groups.set(id, prev ? {
				...g,
				props: {
					...prev.props,
					...definedProps(g.props)
				}
			} : g);
		}
		for (const [id, t] of doc.tokens) {
			tokens.set(id, t);
			layerOf.set(id, layer);
		}
	});
	const descendantsOf = /* @__PURE__ */ new Map();
	for (const id of tokens.keys()) {
		const parts = id.split(".");
		for (let i = 1; i < parts.length; i++) {
			const ancestor = parts.slice(0, i).join(".");
			if (tokens.has(ancestor)) descendantsOf.set(ancestor, [...descendantsOf.get(ancestor) ?? [], id]);
		}
	}
	for (const id of [...descendantsOf.keys()].sort()) {
		if (!tokens.has(id)) continue;
		const descendants = descendantsOf.get(id).filter((d) => tokens.has(d));
		if (descendants.length === 0) continue;
		const tokenLayer = layerOf.get(id) ?? 0;
		const newestDescendantLayer = Math.max(...descendants.map((d) => layerOf.get(d) ?? 0));
		const t = tokens.get(id);
		diag.warn("tokens/token-group-conflict", `"${id}" is a token in one source and a group in another; the later source wins`, t.origin);
		if (tokenLayer >= newestDescendantLayer) for (const d of descendants) tokens.delete(d);
		else tokens.delete(id);
	}
	for (const id of tokens.keys()) groups.delete(id);
	return {
		tokens,
		groups
	};
}
function definedProps(p) {
	const out = {};
	for (const [k, v] of Object.entries(p)) if (v !== void 0) out[k] = v;
	return out;
}
/** Parses a `$extends` value (`"{group}"` or `{ "$ref": "#/group" }`) into a group id. */
function parseExtendsTarget(value) {
	if (typeof value === "string") {
		const m = /^\{([^{}]+)\}$/.exec(value);
		return m ? m[1] : null;
	}
	if (value !== null && typeof value === "object" && typeof value.$ref === "string") {
		const segs = parsePointer(value.$ref);
		return segs ? tokenId(segs) : null;
	}
	return null;
}
/**
* Expands `$extends` (Format 2025.10, section 6.4) after merging: deep merge where local
* definitions win and inherited tokens are copied whole. Mutates `doc`.
*/
function expandExtends(doc, diag) {
	const targets = /* @__PURE__ */ new Map();
	for (const [id, g] of doc.groups) {
		if (g.props.extends === void 0) continue;
		const target = parseExtendsTarget(g.props.extends);
		if (target === null) diag.error("dtcg/extends-invalid", "$extends must be \"{group}\" or a JSON Pointer reference", g.origin);
		else if (doc.tokens.has(target)) diag.error("dtcg/extends-invalid-target", `$extends points to token "${target}", not a group`, g.origin);
		else if (!doc.groups.has(target)) diag.error("dtcg/extends-unresolved", `$extends target group "${target}" not found`, g.origin);
		else if (target === id || isUnder(id, target)) diag.error("dtcg/extends-cycle", `Group "${id}" extends its own ancestor "${target}"`, g.origin);
		else targets.set(id, target);
	}
	const state = /* @__PURE__ */ new Map();
	const inCycle = /* @__PURE__ */ new Set();
	const visit = (id, stack) => {
		const s = state.get(id);
		if (s === "done") return;
		if (s === "visiting") {
			for (const member of stack.slice(stack.indexOf(id))) inCycle.add(member);
			return;
		}
		state.set(id, "visiting");
		const t = targets.get(id);
		if (t !== void 0) visit(t, [...stack, id]);
		state.set(id, "done");
	};
	for (const id of targets.keys()) visit(id, []);
	for (const id of inCycle) {
		diag.error("dtcg/extends-cycle", `Circular $extends chain involving "${id}"`, doc.groups.get(id)?.origin);
		targets.delete(id);
	}
	const expanded = /* @__PURE__ */ new Set();
	const expand = (id) => {
		if (expanded.has(id)) return;
		expanded.add(id);
		const target = targets.get(id);
		if (target === void 0) return;
		expand(target);
		const group = doc.groups.get(id);
		const source = doc.groups.get(target);
		for (const key of [
			"type",
			"description",
			"deprecated",
			"extensions"
		]) if (group.props[key] === void 0 && source.props[key] !== void 0) group.props[key] = source.props[key];
		const rebase = (other) => (id === "" ? "" : `${id}.`) + other.slice(target.length + 1);
		for (const [gid, g] of [...doc.groups]) {
			if (gid === target || !isUnder(gid, target)) continue;
			const nid = rebase(gid);
			if (!doc.groups.has(nid) && !doc.tokens.has(nid)) doc.groups.set(nid, {
				...g,
				id: nid,
				path: nid.split("."),
				props: { ...g.props }
			});
		}
		for (const [tid, t] of [...doc.tokens]) {
			if (!isUnder(tid, target)) continue;
			const nid = rebase(tid);
			if (doc.tokens.has(nid) || doc.groups.has(nid)) continue;
			doc.tokens.set(nid, {
				...t,
				id: nid,
				path: nid.split("."),
				inheritedFrom: t.inheritedFrom ?? t.id
			});
		}
	};
	for (const id of [...targets.keys()].sort()) expand(id);
}
//#endregion
//#region ../dsgraph-core/dist/values/expression.js
const UNITS = /* @__PURE__ */ new Set([
	"",
	"px",
	"rem",
	"em",
	"%",
	"ms",
	"s",
	"deg",
	"pt",
	"vw",
	"vh",
	"ch",
	"ex"
]);
const round = (n) => Math.round(n * 1e6) / 1e6;
/** Evaluates `+ - * /` and parentheses over numbers with units; undefined if not arithmetic. */
function evaluateMath(text) {
	const src = text.replace(/calc\(/gi, "(");
	const tokens = [];
	const re = /\s*(?:((?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)([a-z%]*)|([-+*/()]))/iy;
	let i = 0;
	while (i < src.length) {
		if (/^\s*$/.test(src.slice(i))) break;
		re.lastIndex = i;
		const m = re.exec(src);
		if (!m) return void 0;
		i = re.lastIndex;
		if (m[3]) tokens.push(m[3]);
		else {
			const unit = m[2].toLowerCase();
			if (!UNITS.has(unit)) return void 0;
			tokens.push({
				value: Number(m[1]),
				unit
			});
		}
	}
	if (tokens.length === 0) return void 0;
	let pos = 0;
	const peek = () => tokens[pos];
	const combine = (op, a, b) => {
		switch (op) {
			case "+":
			case "-":
				if (a.unit && b.unit && a.unit !== b.unit) return void 0;
				return {
					value: op === "+" ? a.value + b.value : a.value - b.value,
					unit: a.unit || b.unit
				};
			case "*":
				if (a.unit && b.unit) return void 0;
				return {
					value: a.value * b.value,
					unit: a.unit || b.unit
				};
			default:
				if (b.value === 0) return void 0;
				if (!b.unit) return {
					value: a.value / b.value,
					unit: a.unit
				};
				if (a.unit === b.unit) return {
					value: a.value / b.value,
					unit: ""
				};
				return;
		}
	};
	const factor = () => {
		const t = peek();
		if (t === "-" || t === "+") {
			pos++;
			const f = factor();
			return f && (t === "-" ? {
				value: -f.value,
				unit: f.unit
			} : f);
		}
		if (t === "(") {
			pos++;
			const e = expr();
			if (peek() !== ")") return void 0;
			pos++;
			return e;
		}
		if (typeof t === "object") {
			pos++;
			return t;
		}
	};
	const term = () => {
		let a = factor();
		while (a && (peek() === "*" || peek() === "/")) {
			const op = tokens[pos++];
			const b = factor();
			a = b && combine(op, a, b);
		}
		return a;
	};
	function expr() {
		let a = term();
		while (a && (peek() === "+" || peek() === "-")) {
			const op = tokens[pos++];
			const b = term();
			a = b && combine(op, a, b);
		}
		return a;
	}
	const result = expr();
	if (!result || pos !== tokens.length || !Number.isFinite(result.value)) return void 0;
	return {
		value: round(result.value),
		unit: result.unit
	};
}
/** Text that stands for a resolved value inside an expression; undefined if it has none. */
function serializeForExpression(v) {
	if (typeof v === "number") return String(v);
	if (typeof v === "string") return v;
	if (Array.isArray(v)) return v.every((x) => typeof x === "string") ? v.join(", ") : void 0;
	if (!isPlainObject(v)) return void 0;
	if (typeof v.value === "number" && typeof v.unit === "string") return `${v.value}${v.unit}`;
	const color = looseColor(v);
	return color ? colorToCss(color) : void 0;
}
/** `rgba(<color>, <alpha>)`: a color with a new alpha, as token-set files write it. */
function colorWithAlpha(text) {
	const m = /^rgba?\((.+),\s*(\d*\.?\d+%?)\s*\)$/is.exec(text.trim());
	if (!m) return void 0;
	const base = looseColor(m[1]);
	if (!base || /^[\d.\s,%]+$/.test(m[1])) return void 0;
	const alpha = m[2].endsWith("%") ? Number.parseFloat(m[2]) / 100 : Number(m[2]);
	if (!(alpha >= 0 && alpha <= 1)) return void 0;
	const { hex: _hex, ...rest } = base;
	return colorToDtcg({
		...rest,
		alpha
	});
}
/**
* Evaluates expression text (references already substituted) into a DTCG value: a color, a
* dimension `{ value, unit }` or a number. Undefined when the text is neither.
* A unitless result of a dimension takes `defaultUnit` (token sets: px).
*/
function evaluateExpression(text, hint, defaultUnit) {
	if (hint === "color" || /^(rgba?|hsla?|#)/i.test(text.trim())) {
		const color = colorWithAlpha(text) ?? cssColorToDtcg(text);
		if (color) return color;
		if (hint === "color") return void 0;
	}
	const q = evaluateMath(text);
	if (!q) return void 0;
	if (hint === "number" && q.unit === "%") return round(q.value / 100);
	if (q.unit === "") {
		if (hint === "dimension" && defaultUnit) return {
			value: q.value,
			unit: defaultUnit
		};
		return q.value;
	}
	return {
		value: q.value,
		unit: q.unit
	};
}
const conv = (mode) => converter(mode);
const OUT_SPACE = {
	lch: "lch",
	hsl: "hsl",
	srgb: "rgb",
	p3: "p3"
};
const toLch = conv("lch");
const toHsl = conv("hsl");
const toRgb$1 = conv("rgb");
const toP3 = conv("p3");
const toOklch = conv("oklch");
const clamp01 = (n) => Math.max(0, Math.min(1, n));
/**
* Applies a token-set color modifier (lighten, darken, mix, alpha, with the formulas the common token
* build tools use) and
* returns a DTCG color object in the modifier's space.
*/
function modifyColor(base, mod) {
	const a = mod.amount;
	if (!Number.isFinite(a)) return void 0;
	const c = toCulori(base);
	let out;
	const up = mod.type === "lighten";
	switch (mod.type) {
		case "lighten":
		case "darken":
			if (mod.space === "lch") {
				const x = toLch(c);
				const l = x.l ?? 0;
				out = {
					...x,
					l: up ? Math.min(100, l + (100 - l) * a) : Math.max(0, l - l * a),
					c: Math.max(0, (x.c ?? 0) - a * (x.c ?? 0))
				};
			} else if (mod.space === "hsl") {
				const x = toHsl(c);
				const l = x.l ?? 0;
				out = {
					...x,
					l: up ? Math.min(1, l + (1 - l) * a) : Math.max(0, l - l * a)
				};
			} else if (mod.space === "srgb" || mod.space === "p3") {
				const x = mod.space === "p3" ? toP3(c) : toRgb$1(c);
				const f = (v) => up ? Math.min(1, v + a * (1 - v)) : Math.max(0, v - a * v);
				out = {
					...x,
					r: f(x.r),
					g: f(x.g),
					b: f(x.b)
				};
			} else {
				const x = toOklch(c);
				out = {
					...x,
					l: clamp01((x.l ?? 0) * (up ? 1 + a : 1 - a))
				};
			}
			break;
		case "mix": {
			if (!mod.with) return void 0;
			const mode = OUT_SPACE[mod.space] ?? "rgb";
			out = interpolate([c, toCulori(mod.with)], mode)(clamp01(a));
			break;
		}
		case "alpha":
			out = {
				...c,
				alpha: clamp01(a)
			};
			break;
		default: return;
	}
	const target = OUT_SPACE[mod.space];
	if (target) out = conv(target)(out);
	return colorToDtcg(fromCulori(out));
}
//#endregion
//#region ../dsgraph-core/dist/dtcg/resolve.js
const CURLY = /^\{([^{}]+)\}$/;
const EMBEDDED = /\{([^{}]+)\}/g;
const devExtension = (node) => {
	const ext = node.$extensions;
	return isPlainObject(ext) && isPlainObject(ext["dev.dsgraph"]) ? ext["dev.dsgraph"] : void 0;
};
const HINT_BY_KEY = {
	color: "color",
	fontSize: "dimension",
	letterSpacing: "dimension",
	offsetX: "dimension",
	offsetY: "dimension",
	blur: "dimension",
	spread: "dimension",
	width: "dimension",
	lineHeight: "number",
	alpha: "number"
};
const HINT_BY_TYPE = {
	color: "color",
	dimension: "dimension",
	number: "number",
	fontWeight: "number"
};
/**
* Resolves types, references and canonical values of a merged, `$extends`-expanded document
* (Format 2025.10 sections 5.2.2, 7; Resolver 2025.10 section 6.3).
*/
function resolveDoc(doc, diag, opts) {
	const typeMemo = /* @__PURE__ */ new Map();
	const rawMemo = /* @__PURE__ */ new Map();
	const cyclic = /* @__PURE__ */ new Set();
	const reported = /* @__PURE__ */ new Set();
	const loc = (t) => t.origin;
	/** Parses a reference expression at any position: `"{a.b}"` or `{ "$ref": "#/a/b/$value/x" }`. */
	const parseRef = (v, t) => {
		if (typeof v === "string") {
			const m = CURLY.exec(v);
			return m ? { id: m[1] } : void 0;
		}
		if (isPlainObject(v) && typeof v.$ref === "string" && Object.keys(v).length === 1) {
			const segs = parsePointer(v.$ref);
			if (!segs) {
				diag.error("dtcg/invalid-reference", `Malformed JSON Pointer "${v.$ref}"`, loc(t));
				return null;
			}
			const i = segs.indexOf("$value");
			if (i >= 0) return {
				id: tokenId(segs.slice(0, i)),
				path: segs.slice(i + 1)
			};
			if (segs.length > 0 && segs[segs.length - 1].startsWith("$")) {
				diag.error("dtcg/invalid-reference", `References to "${segs.at(-1)}" are not supported`, loc(t));
				return null;
			}
			return { id: tokenId(segs) };
		}
	};
	const typeOf = (id, stack = []) => {
		const memo = typeMemo.get(id);
		if (memo) return memo;
		const t = doc.tokens.get(id);
		if (!t) return {
			type: null,
			source: null
		};
		let result = {
			type: null,
			source: null
		};
		if (typeof t.node.$type === "string") {
			const inferred = t.node.$extensions?.["dev.dsgraph"]?.typeInferred;
			result = {
				type: t.node.$type,
				source: inferred ? "inferred" : "explicit"
			};
		} else {
			const ref = parseRef(t.node.$value, t);
			if (ref && !ref.path && doc.tokens.has(ref.id) && !stack.includes(ref.id)) {
				const target = typeOf(ref.id, [...stack, id]);
				if (target.type) result = {
					type: target.type,
					source: "alias"
				};
			}
			if (!result.type) for (let i = t.path.length - 1; i >= 0; i--) {
				const g = doc.groups.get(tokenId(t.path.slice(0, i)));
				if (g?.props.type) {
					result = {
						type: g.props.type,
						source: "inherited"
					};
					break;
				}
			}
		}
		typeMemo.set(id, result);
		return result;
	};
	const resolveRaw = (id, stack) => {
		const memo = rawMemo.get(id);
		if (memo) return memo;
		const t = doc.tokens.get(id);
		const refs = [];
		let ok = true;
		const dev = devExtension(t.node);
		const expression = dev?.expression;
		const defaultUnit = typeof expression === "object" ? expression.unit : void 0;
		const follow = (target, at) => {
			const property = at.length > 0 ? toPointer(at) : void 0;
			if (!doc.tokens.has(target.id)) {
				if (doc.groups.has(target.id)) diag.error("dtcg/reference-to-group", `"${target.id}" is a group; references must target tokens`, loc(t));
				else diag.error("dtcg/unknown-reference", `Reference to unknown token "${target.id}"`, loc(t));
				ok = false;
				return;
			}
			const ref = { to: target.id };
			if (property) ref.property = property;
			if (target.path && target.path.length > 0) ref.targetPath = toPointer(target.path);
			refs.push(ref);
			if (stack.includes(target.id) || target.id === id) {
				const cycle = [...stack.slice(stack.indexOf(target.id)), id];
				for (const member of cycle) cyclic.add(member);
				ok = false;
				return;
			}
			const r = resolveRaw(target.id, [...stack, id]);
			if (!r.ok) {
				ok = false;
				return;
			}
			if (!target.path || target.path.length === 0) return r.value;
			const found = getAt(r.value, target.path);
			if (!found.found) {
				diag.error("dtcg/invalid-reference", `"${toPointer(target.path)}" not found in "${target.id}"`, loc(t));
				ok = false;
				return;
			}
			return found.value;
		};
		/** Text with references inside (`{a} * 2`, `rgba({ink}, 0.5)`), evaluated after substitution. */
		const evaluate = (text, at, hint) => {
			let failed = false;
			const substituted = text.replace(EMBEDDED, (whole, target) => {
				const v = follow({ id: target.trim() }, at);
				const s = v === void 0 ? void 0 : serializeForExpression(v);
				if (s === void 0) failed = true;
				return s ?? whole;
			});
			if (failed) {
				ok = false;
				return;
			}
			const value = evaluateExpression(substituted, hint, defaultUnit);
			if (value === void 0) {
				diag.error("dtcg/invalid-expression", `Cannot evaluate "${text}"`, loc(t));
				ok = false;
			}
			return value;
		};
		const substitute = (v, at) => {
			const ref = parseRef(v, t);
			if (ref === null) {
				ok = false;
				return;
			}
			if (ref) return follow(ref, at);
			if (expression && typeof v === "string" && v.includes("{")) {
				const type = typeOf(id).type;
				const hint = at.length === 0 ? HINT_BY_TYPE[type ?? ""] : HINT_BY_KEY[at[at.length - 1]];
				return evaluate(v, at, hint);
			}
			if (Array.isArray(v)) return v.map((item, i) => substitute(item, [...at, String(i)]));
			if (isPlainObject(v)) {
				const out = {};
				for (const [k, item] of Object.entries(v)) out[k] = substitute(item, [...at, k]);
				return out;
			}
			return v;
		};
		rawMemo.set(id, {
			value: void 0,
			refs,
			ok: false
		});
		let value = substitute(t.node.$value, []);
		const mod = dev?.colorModifier;
		if (mod && ok) value = applyModifier(value, mod);
		const result = {
			value,
			refs,
			ok: ok && !cyclic.has(id)
		};
		rawMemo.set(id, result);
		return result;
		function applyModifier(base, mod) {
			const color = looseColor(base);
			let amount = mod.value;
			if (typeof amount === "string") {
				const whole = parseRef(amount, t);
				amount = whole ? follow(whole, []) : amount.includes("{") ? evaluate(amount, [], "number") : amount;
				if (typeof amount === "string") amount = evaluateExpression(amount, "number");
			}
			let withColor = mod.color;
			if (typeof withColor === "string" && CURLY.test(withColor)) withColor = follow(parseRef(withColor, t), []);
			const m = {
				type: mod.type,
				amount: typeof amount === "number" ? amount : NaN,
				space: mod.space ?? "srgb"
			};
			const w = looseColor(withColor);
			if (w) m.with = w;
			const out = color ? modifyColor(color, m) : void 0;
			if (out === void 0) {
				if (ok) diag.error("dtcg/invalid-color-modifier", `Cannot apply the "${mod.type}" color modifier`, loc(t));
				ok = false;
			}
			return out;
		}
	};
	const deprecationOf = (t) => {
		let dep = t.node.$deprecated;
		if (dep === void 0) for (let i = t.path.length - 1; i >= 0; i--) {
			const g = doc.groups.get(tokenId(t.path.slice(0, i)));
			if (g?.props.deprecated !== void 0) {
				dep = g.props.deprecated;
				break;
			}
		}
		if (dep === true) return {};
		if (typeof dep === "string") {
			const d = { reason: dep };
			const m = /\{([^{}]+)\}/.exec(dep);
			if (m && doc.tokens.has(m[1])) d.replacement = m[1];
			return d;
		}
		return null;
	};
	const tokens = /* @__PURE__ */ new Map();
	for (const id of [...doc.tokens.keys()].sort()) {
		const t = doc.tokens.get(id);
		const flags = new Set(t.flags);
		const { type, source } = typeOf(id);
		if (!type) diag.error("dtcg/untyped", `Token "${id}" has no $type and none can be inherited`, loc(t));
		else if (!STANDARD_TYPES.has(type) && !INTERNAL_TYPES.has(type)) {
			if (opts.allowNonstandardTypes && !opts.strict) {} else if (opts.strict) diag.error("dtcg/unknown-type", `"${type}" is not a DTCG 2025.10 type`, loc(t));
			else diag.warn("dtcg/unknown-type", `"${type}" is not a DTCG 2025.10 type`, loc(t));
			flags.add("nonstandard-type");
		}
		const resolved = resolveRaw(id, []);
		if (cyclic.has(id) && !reported.has(id)) {
			reported.add(id);
			diag.error("dtcg/alias-cycle", `Token "${id}" is part of a circular reference chain`, loc(t));
		}
		const whole = parseRef(t.node.$value, t);
		if (whole && !whole.path && type && source === "explicit" && doc.tokens.has(whole.id)) {
			const targetType = typeOf(whole.id).type;
			if (targetType && targetType !== type) diag.error("dtcg/alias-type-mismatch", `"${id}" is ${type} but references ${targetType} "${whole.id}"`, loc(t));
		}
		let value = null;
		if (type && resolved.ok) {
			const ctx = {
				strict: opts.strict,
				allowNonstandardUnits: opts.allowNonstandardUnits ?? false,
				diag,
				loc: loc(t),
				flags
			};
			const v = canonicalValue(type, resolved.value, ctx);
			value = v === void 0 ? null : v;
		} else if (!resolved.ok) flags.add("unresolved");
		if (type === "css-expression" && typeof t.node.$value === "string") for (const m of t.node.$value.matchAll(/var\(\s*--([\w-]+)/g)) {
			const to = m[1];
			if (doc.tokens.has(to) && !resolved.refs.some((r) => r.to === to)) resolved.refs.push({ to });
		}
		if (source === "inferred") flags.add("type-inferred");
		const token = {
			id,
			path: t.path,
			type,
			typeSource: source,
			raw: t.node.$value,
			value,
			refs: resolved.refs,
			deprecated: deprecationOf(t),
			origin: t.origin,
			inheritedFrom: t.inheritedFrom,
			flags: [...flags].sort()
		};
		if (typeof t.node.$description === "string") token.description = t.node.$description;
		if (isPlainObject(t.node.$extensions)) token.extensions = t.node.$extensions;
		tokens.set(id, token);
	}
	const groups = [];
	for (const [id, g] of [...doc.groups].sort(([a], [b]) => a.localeCompare(b))) {
		if (id === "") continue;
		const group = {
			id,
			path: g.path,
			origin: g.origin
		};
		if (g.props.type) group.type = g.props.type;
		if (g.props.description) group.description = g.props.description;
		if (g.props.deprecated === true) group.deprecated = {};
		else if (typeof g.props.deprecated === "string") group.deprecated = { reason: g.props.deprecated };
		const ext = g.props.extends !== void 0 ? parseExtendsTarget(g.props.extends) : null;
		if (ext) group.extends = ext;
		if (g.props.extensions) group.extensions = g.props.extensions;
		groups.push(group);
	}
	return {
		tokens,
		groups
	};
}
//#endregion
//#region ../dsgraph-core/dist/graph.js
/** Read-only query API over a snapshot. Works the same in the browser and in Node. */
var DsGraph = class DsGraph {
	snapshot;
	byId = /* @__PURE__ */ new Map();
	groupsById = /* @__PURE__ */ new Map();
	out = /* @__PURE__ */ new Map();
	in = /* @__PURE__ */ new Map();
	byName;
	constructor(snapshot) {
		this.snapshot = snapshot;
		for (const t of snapshot.nodes.tokens) this.byId.set(t.id, t);
		for (const g of snapshot.nodes.groups) this.groupsById.set(g.id, g);
		for (const e of snapshot.edges) {
			push(this.out, e[1], e);
			push(this.in, e[2], e);
		}
	}
	static from(snapshot) {
		return new DsGraph(snapshot);
	}
	get modifiers() {
		return this.snapshot.contexts.modifiers;
	}
	defaultInput(configured) {
		return defaultInput(this.modifiers, configured);
	}
	inputs() {
		return enumerateInputs(this.modifiers);
	}
	token(id) {
		return this.byId.get(id);
	}
	group(id) {
		return this.groupsById.get(id);
	}
	tokens(filter = {}) {
		const types = filter.type === void 0 ? void 0 : new Set([filter.type].flat());
		return this.snapshot.nodes.tokens.filter((t) => (!types || t.type !== null && types.has(t.type)) && (filter.layer === void 0 || t.layer === filter.layer) && (filter.deprecated === void 0 || t.deprecated !== null === filter.deprecated) && (filter.path === void 0 || matchPath(t.id, filter.path)));
	}
	/** The value entry that applies to `input` (default input when omitted). */
	entry(id, input) {
		const t = this.byId.get(id);
		if (!t) return void 0;
		const i = input ?? this.defaultInput();
		return t.values.find((v) => Object.entries(v.when).every(([k, c]) => i[k] === void 0 || i[k] === c));
	}
	value(id, input) {
		return this.entry(id, input)?.value;
	}
	/** Whole-value alias chain from `id` to the token holding the literal value. */
	chain(id, input) {
		const chain = [id];
		let cur = id;
		for (;;) {
			const whole = this.entry(cur, input)?.refs.find((r) => !r.property && !r.targetPath);
			if (!whole || chain.includes(whole.to)) return chain;
			chain.push(whole.to);
			cur = whole.to;
		}
	}
	edges(kind) {
		return kind ? this.snapshot.edges.filter((e) => e[0] === kind) : this.snapshot.edges;
	}
	/** Tokens this token references (directly or transitively). */
	dependencies(id, opts = {}) {
		return this.walk(id, this.out, 2, opts);
	}
	/** Tokens (and later code nodes) that reference this token. */
	dependents(id, opts = {}) {
		return this.walk(id, this.in, 1, opts);
	}
	/** Every token whose value equals `value` in the given context; colors within `toleranceDeltaE`. */
	byValue(value, opts = {}) {
		const cmp = {
			...DEFAULT_COMPARE,
			...opts
		};
		const key = canonicalize(value);
		const hits = [];
		for (const t of this.snapshot.nodes.tokens) {
			if (opts.type && t.type !== opts.type) continue;
			const v = this.entry(t.id, opts.input)?.value;
			if (v === void 0 || v === null) continue;
			if (canonicalize(v) === key) hits.push({
				t,
				exact: true
			});
			else if (compareValues(t.type, v, value, cmp).result !== "changed") hits.push({
				t,
				exact: false
			});
		}
		return hits.sort((a, b) => Number(b.exact) - Number(a.exact) || a.t.id.localeCompare(b.t.id)).map((h) => h.t);
	}
	/** Tokens whose normalized name matches a CSS custom property name. */
	byCssVar(name, prefix = "--") {
		if (!this.byName) {
			this.byName = /* @__PURE__ */ new Map();
			for (const t of this.snapshot.nodes.tokens) push(this.byName, normalizeName(t.id), t);
		}
		return this.byName.get(cssVarToName(name, prefix)) ?? [];
	}
	walk(id, index, side, opts) {
		const kinds = new Set(opts.kinds ?? ["aliases"]);
		const seen = /* @__PURE__ */ new Set();
		const queue = [id];
		while (queue.length) {
			const cur = queue.shift();
			for (const e of index.get(cur) ?? []) {
				if (!kinds.has(e[0])) continue;
				const next = e[side];
				if (next === id || seen.has(next)) continue;
				seen.add(next);
				if (opts.transitive) queue.push(next);
			}
		}
		return [...seen].sort();
	}
};
function push(map, key, value) {
	const list = map.get(key);
	if (list) list.push(value);
	else map.set(key, [value]);
}
//#endregion
//#region ../../node_modules/json5/lib/unicode.js
var require_unicode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
	module.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
	module.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
}));
//#endregion
//#region ../../node_modules/json5/lib/util.js
var require_util$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const unicode = require_unicode();
	module.exports = {
		isSpaceSeparator(c) {
			return typeof c === "string" && unicode.Space_Separator.test(c);
		},
		isIdStartChar(c) {
			return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
		},
		isIdContinueChar(c) {
			return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "‌" || c === "‍" || unicode.ID_Continue.test(c));
		},
		isDigit(c) {
			return typeof c === "string" && /[0-9]/.test(c);
		},
		isHexDigit(c) {
			return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
		}
	};
}));
//#endregion
//#region ../../node_modules/json5/lib/parse.js
var require_parse$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const util = require_util$1();
	let source;
	let parseState;
	let stack;
	let pos;
	let line;
	let column;
	let token;
	let key;
	let root;
	module.exports = function parse(text, reviver) {
		source = String(text);
		parseState = "start";
		stack = [];
		pos = 0;
		line = 1;
		column = 0;
		token = void 0;
		key = void 0;
		root = void 0;
		do {
			token = lex();
			parseStates[parseState]();
		} while (token.type !== "eof");
		if (typeof reviver === "function") return internalize({ "": root }, "", reviver);
		return root;
	};
	function internalize(holder, name, reviver) {
		const value = holder[name];
		if (value != null && typeof value === "object") {
			if (Array.isArray(value)) for (let i = 0; i < value.length; i++) {
				const key = String(i);
				const replacement = internalize(value, key, reviver);
				if (replacement === void 0) delete value[key];
				else Object.defineProperty(value, key, {
					value: replacement,
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
			else for (const key in value) {
				const replacement = internalize(value, key, reviver);
				if (replacement === void 0) delete value[key];
				else Object.defineProperty(value, key, {
					value: replacement,
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
		}
		return reviver.call(holder, name, value);
	}
	let lexState;
	let buffer;
	let doubleQuote;
	let sign;
	let c;
	function lex() {
		lexState = "default";
		buffer = "";
		doubleQuote = false;
		sign = 1;
		for (;;) {
			c = peek();
			const token = lexStates[lexState]();
			if (token) return token;
		}
	}
	function peek() {
		if (source[pos]) return String.fromCodePoint(source.codePointAt(pos));
	}
	function read() {
		const c = peek();
		if (c === "\n") {
			line++;
			column = 0;
		} else if (c) column += c.length;
		else column++;
		if (c) pos += c.length;
		return c;
	}
	const lexStates = {
		default() {
			switch (c) {
				case "	":
				case "\v":
				case "\f":
				case " ":
				case "\xA0":
				case "﻿":
				case "\n":
				case "\r":
				case "\u2028":
				case "\u2029":
					read();
					return;
				case "/":
					read();
					lexState = "comment";
					return;
				case void 0:
					read();
					return newToken("eof");
			}
			if (util.isSpaceSeparator(c)) {
				read();
				return;
			}
			return lexStates[parseState]();
		},
		comment() {
			switch (c) {
				case "*":
					read();
					lexState = "multiLineComment";
					return;
				case "/":
					read();
					lexState = "singleLineComment";
					return;
			}
			throw invalidChar(read());
		},
		multiLineComment() {
			switch (c) {
				case "*":
					read();
					lexState = "multiLineCommentAsterisk";
					return;
				case void 0: throw invalidChar(read());
			}
			read();
		},
		multiLineCommentAsterisk() {
			switch (c) {
				case "*":
					read();
					return;
				case "/":
					read();
					lexState = "default";
					return;
				case void 0: throw invalidChar(read());
			}
			read();
			lexState = "multiLineComment";
		},
		singleLineComment() {
			switch (c) {
				case "\n":
				case "\r":
				case "\u2028":
				case "\u2029":
					read();
					lexState = "default";
					return;
				case void 0:
					read();
					return newToken("eof");
			}
			read();
		},
		value() {
			switch (c) {
				case "{":
				case "[": return newToken("punctuator", read());
				case "n":
					read();
					literal("ull");
					return newToken("null", null);
				case "t":
					read();
					literal("rue");
					return newToken("boolean", true);
				case "f":
					read();
					literal("alse");
					return newToken("boolean", false);
				case "-":
				case "+":
					if (read() === "-") sign = -1;
					lexState = "sign";
					return;
				case ".":
					buffer = read();
					lexState = "decimalPointLeading";
					return;
				case "0":
					buffer = read();
					lexState = "zero";
					return;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					buffer = read();
					lexState = "decimalInteger";
					return;
				case "I":
					read();
					literal("nfinity");
					return newToken("numeric", Infinity);
				case "N":
					read();
					literal("aN");
					return newToken("numeric", NaN);
				case "\"":
				case "'":
					doubleQuote = read() === "\"";
					buffer = "";
					lexState = "string";
					return;
			}
			throw invalidChar(read());
		},
		identifierNameStartEscape() {
			if (c !== "u") throw invalidChar(read());
			read();
			const u = unicodeEscape();
			switch (u) {
				case "$":
				case "_": break;
				default: if (!util.isIdStartChar(u)) throw invalidIdentifier();
			}
			buffer += u;
			lexState = "identifierName";
		},
		identifierName() {
			switch (c) {
				case "$":
				case "_":
				case "‌":
				case "‍":
					buffer += read();
					return;
				case "\\":
					read();
					lexState = "identifierNameEscape";
					return;
			}
			if (util.isIdContinueChar(c)) {
				buffer += read();
				return;
			}
			return newToken("identifier", buffer);
		},
		identifierNameEscape() {
			if (c !== "u") throw invalidChar(read());
			read();
			const u = unicodeEscape();
			switch (u) {
				case "$":
				case "_":
				case "‌":
				case "‍": break;
				default: if (!util.isIdContinueChar(u)) throw invalidIdentifier();
			}
			buffer += u;
			lexState = "identifierName";
		},
		sign() {
			switch (c) {
				case ".":
					buffer = read();
					lexState = "decimalPointLeading";
					return;
				case "0":
					buffer = read();
					lexState = "zero";
					return;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					buffer = read();
					lexState = "decimalInteger";
					return;
				case "I":
					read();
					literal("nfinity");
					return newToken("numeric", sign * Infinity);
				case "N":
					read();
					literal("aN");
					return newToken("numeric", NaN);
			}
			throw invalidChar(read());
		},
		zero() {
			switch (c) {
				case ".":
					buffer += read();
					lexState = "decimalPoint";
					return;
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
				case "x":
				case "X":
					buffer += read();
					lexState = "hexadecimal";
					return;
			}
			return newToken("numeric", sign * 0);
		},
		decimalInteger() {
			switch (c) {
				case ".":
					buffer += read();
					lexState = "decimalPoint";
					return;
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalPointLeading() {
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalFraction";
				return;
			}
			throw invalidChar(read());
		},
		decimalPoint() {
			switch (c) {
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalFraction";
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalFraction() {
			switch (c) {
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalExponent() {
			switch (c) {
				case "+":
				case "-":
					buffer += read();
					lexState = "decimalExponentSign";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalExponentInteger";
				return;
			}
			throw invalidChar(read());
		},
		decimalExponentSign() {
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalExponentInteger";
				return;
			}
			throw invalidChar(read());
		},
		decimalExponentInteger() {
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		hexadecimal() {
			if (util.isHexDigit(c)) {
				buffer += read();
				lexState = "hexadecimalInteger";
				return;
			}
			throw invalidChar(read());
		},
		hexadecimalInteger() {
			if (util.isHexDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		string() {
			switch (c) {
				case "\\":
					read();
					buffer += escape();
					return;
				case "\"":
					if (doubleQuote) {
						read();
						return newToken("string", buffer);
					}
					buffer += read();
					return;
				case "'":
					if (!doubleQuote) {
						read();
						return newToken("string", buffer);
					}
					buffer += read();
					return;
				case "\n":
				case "\r": throw invalidChar(read());
				case "\u2028":
				case "\u2029":
					separatorChar(c);
					break;
				case void 0: throw invalidChar(read());
			}
			buffer += read();
		},
		start() {
			switch (c) {
				case "{":
				case "[": return newToken("punctuator", read());
			}
			lexState = "value";
		},
		beforePropertyName() {
			switch (c) {
				case "$":
				case "_":
					buffer = read();
					lexState = "identifierName";
					return;
				case "\\":
					read();
					lexState = "identifierNameStartEscape";
					return;
				case "}": return newToken("punctuator", read());
				case "\"":
				case "'":
					doubleQuote = read() === "\"";
					lexState = "string";
					return;
			}
			if (util.isIdStartChar(c)) {
				buffer += read();
				lexState = "identifierName";
				return;
			}
			throw invalidChar(read());
		},
		afterPropertyName() {
			if (c === ":") return newToken("punctuator", read());
			throw invalidChar(read());
		},
		beforePropertyValue() {
			lexState = "value";
		},
		afterPropertyValue() {
			switch (c) {
				case ",":
				case "}": return newToken("punctuator", read());
			}
			throw invalidChar(read());
		},
		beforeArrayValue() {
			if (c === "]") return newToken("punctuator", read());
			lexState = "value";
		},
		afterArrayValue() {
			switch (c) {
				case ",":
				case "]": return newToken("punctuator", read());
			}
			throw invalidChar(read());
		},
		end() {
			throw invalidChar(read());
		}
	};
	function newToken(type, value) {
		return {
			type,
			value,
			line,
			column
		};
	}
	function literal(s) {
		for (const c of s) {
			if (peek() !== c) throw invalidChar(read());
			read();
		}
	}
	function escape() {
		switch (peek()) {
			case "b":
				read();
				return "\b";
			case "f":
				read();
				return "\f";
			case "n":
				read();
				return "\n";
			case "r":
				read();
				return "\r";
			case "t":
				read();
				return "	";
			case "v":
				read();
				return "\v";
			case "0":
				read();
				if (util.isDigit(peek())) throw invalidChar(read());
				return "\0";
			case "x":
				read();
				return hexEscape();
			case "u":
				read();
				return unicodeEscape();
			case "\n":
			case "\u2028":
			case "\u2029":
				read();
				return "";
			case "\r":
				read();
				if (peek() === "\n") read();
				return "";
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9": throw invalidChar(read());
			case void 0: throw invalidChar(read());
		}
		return read();
	}
	function hexEscape() {
		let buffer = "";
		let c = peek();
		if (!util.isHexDigit(c)) throw invalidChar(read());
		buffer += read();
		c = peek();
		if (!util.isHexDigit(c)) throw invalidChar(read());
		buffer += read();
		return String.fromCodePoint(parseInt(buffer, 16));
	}
	function unicodeEscape() {
		let buffer = "";
		let count = 4;
		while (count-- > 0) {
			const c = peek();
			if (!util.isHexDigit(c)) throw invalidChar(read());
			buffer += read();
		}
		return String.fromCodePoint(parseInt(buffer, 16));
	}
	const parseStates = {
		start() {
			if (token.type === "eof") throw invalidEOF();
			push();
		},
		beforePropertyName() {
			switch (token.type) {
				case "identifier":
				case "string":
					key = token.value;
					parseState = "afterPropertyName";
					return;
				case "punctuator":
					pop();
					return;
				case "eof": throw invalidEOF();
			}
		},
		afterPropertyName() {
			if (token.type === "eof") throw invalidEOF();
			parseState = "beforePropertyValue";
		},
		beforePropertyValue() {
			if (token.type === "eof") throw invalidEOF();
			push();
		},
		beforeArrayValue() {
			if (token.type === "eof") throw invalidEOF();
			if (token.type === "punctuator" && token.value === "]") {
				pop();
				return;
			}
			push();
		},
		afterPropertyValue() {
			if (token.type === "eof") throw invalidEOF();
			switch (token.value) {
				case ",":
					parseState = "beforePropertyName";
					return;
				case "}": pop();
			}
		},
		afterArrayValue() {
			if (token.type === "eof") throw invalidEOF();
			switch (token.value) {
				case ",":
					parseState = "beforeArrayValue";
					return;
				case "]": pop();
			}
		},
		end() {}
	};
	function push() {
		let value;
		switch (token.type) {
			case "punctuator":
				switch (token.value) {
					case "{":
						value = {};
						break;
					case "[": value = [];
				}
				break;
			case "null":
			case "boolean":
			case "numeric":
			case "string": value = token.value;
		}
		if (root === void 0) root = value;
		else {
			const parent = stack[stack.length - 1];
			if (Array.isArray(parent)) parent.push(value);
			else Object.defineProperty(parent, key, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		if (value !== null && typeof value === "object") {
			stack.push(value);
			if (Array.isArray(value)) parseState = "beforeArrayValue";
			else parseState = "beforePropertyName";
		} else {
			const current = stack[stack.length - 1];
			if (current == null) parseState = "end";
			else if (Array.isArray(current)) parseState = "afterArrayValue";
			else parseState = "afterPropertyValue";
		}
	}
	function pop() {
		stack.pop();
		const current = stack[stack.length - 1];
		if (current == null) parseState = "end";
		else if (Array.isArray(current)) parseState = "afterArrayValue";
		else parseState = "afterPropertyValue";
	}
	function invalidChar(c) {
		if (c === void 0) return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
		return syntaxError(`JSON5: invalid character '${formatChar(c)}' at ${line}:${column}`);
	}
	function invalidEOF() {
		return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
	}
	function invalidIdentifier() {
		column -= 5;
		return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
	}
	function separatorChar(c) {
		console.warn(`JSON5: '${formatChar(c)}' in strings is not valid ECMAScript; consider escaping`);
	}
	function formatChar(c) {
		const replacements = {
			"'": "\\'",
			"\"": "\\\"",
			"\\": "\\\\",
			"\b": "\\b",
			"\f": "\\f",
			"\n": "\\n",
			"\r": "\\r",
			"	": "\\t",
			"\v": "\\v",
			"\0": "\\0",
			"\u2028": "\\u2028",
			"\u2029": "\\u2029"
		};
		if (replacements[c]) return replacements[c];
		if (c < " ") {
			const hexString = c.charCodeAt(0).toString(16);
			return "\\x" + ("00" + hexString).substring(hexString.length);
		}
		return c;
	}
	function syntaxError(message) {
		const err = new SyntaxError(message);
		err.lineNumber = line;
		err.columnNumber = column;
		return err;
	}
}));
//#endregion
//#region ../../node_modules/json5/lib/stringify.js
var require_stringify$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const util = require_util$1();
	module.exports = function stringify(value, replacer, space) {
		const stack = [];
		let indent = "";
		let propertyList;
		let replacerFunc;
		let gap = "";
		let quote;
		if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
			space = replacer.space;
			quote = replacer.quote;
			replacer = replacer.replacer;
		}
		if (typeof replacer === "function") replacerFunc = replacer;
		else if (Array.isArray(replacer)) {
			propertyList = [];
			for (const v of replacer) {
				let item;
				if (typeof v === "string") item = v;
				else if (typeof v === "number" || v instanceof String || v instanceof Number) item = String(v);
				if (item !== void 0 && propertyList.indexOf(item) < 0) propertyList.push(item);
			}
		}
		if (space instanceof Number) space = Number(space);
		else if (space instanceof String) space = String(space);
		if (typeof space === "number") {
			if (space > 0) {
				space = Math.min(10, Math.floor(space));
				gap = "          ".substr(0, space);
			}
		} else if (typeof space === "string") gap = space.substr(0, 10);
		return serializeProperty("", { "": value });
		function serializeProperty(key, holder) {
			let value = holder[key];
			if (value != null) {
				if (typeof value.toJSON5 === "function") value = value.toJSON5(key);
				else if (typeof value.toJSON === "function") value = value.toJSON(key);
			}
			if (replacerFunc) value = replacerFunc.call(holder, key, value);
			if (value instanceof Number) value = Number(value);
			else if (value instanceof String) value = String(value);
			else if (value instanceof Boolean) value = value.valueOf();
			switch (value) {
				case null: return "null";
				case true: return "true";
				case false: return "false";
			}
			if (typeof value === "string") return quoteString(value, false);
			if (typeof value === "number") return String(value);
			if (typeof value === "object") return Array.isArray(value) ? serializeArray(value) : serializeObject(value);
		}
		function quoteString(value) {
			const quotes = {
				"'": .1,
				"\"": .2
			};
			const replacements = {
				"'": "\\'",
				"\"": "\\\"",
				"\\": "\\\\",
				"\b": "\\b",
				"\f": "\\f",
				"\n": "\\n",
				"\r": "\\r",
				"	": "\\t",
				"\v": "\\v",
				"\0": "\\0",
				"\u2028": "\\u2028",
				"\u2029": "\\u2029"
			};
			let product = "";
			for (let i = 0; i < value.length; i++) {
				const c = value[i];
				switch (c) {
					case "'":
					case "\"":
						quotes[c]++;
						product += c;
						continue;
					case "\0": if (util.isDigit(value[i + 1])) {
						product += "\\x00";
						continue;
					}
				}
				if (replacements[c]) {
					product += replacements[c];
					continue;
				}
				if (c < " ") {
					let hexString = c.charCodeAt(0).toString(16);
					product += "\\x" + ("00" + hexString).substring(hexString.length);
					continue;
				}
				product += c;
			}
			const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
			product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
			return quoteChar + product + quoteChar;
		}
		function serializeObject(value) {
			if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
			stack.push(value);
			let stepback = indent;
			indent = indent + gap;
			let keys = propertyList || Object.keys(value);
			let partial = [];
			for (const key of keys) {
				const propertyString = serializeProperty(key, value);
				if (propertyString !== void 0) {
					let member = serializeKey(key) + ":";
					if (gap !== "") member += " ";
					member += propertyString;
					partial.push(member);
				}
			}
			let final;
			if (partial.length === 0) final = "{}";
			else {
				let properties;
				if (gap === "") {
					properties = partial.join(",");
					final = "{" + properties + "}";
				} else {
					let separator = ",\n" + indent;
					properties = partial.join(separator);
					final = "{\n" + indent + properties + ",\n" + stepback + "}";
				}
			}
			stack.pop();
			indent = stepback;
			return final;
		}
		function serializeKey(key) {
			if (key.length === 0) return quoteString(key, true);
			const firstChar = String.fromCodePoint(key.codePointAt(0));
			if (!util.isIdStartChar(firstChar)) return quoteString(key, true);
			for (let i = firstChar.length; i < key.length; i++) if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) return quoteString(key, true);
			return key;
		}
		function serializeArray(value) {
			if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
			stack.push(value);
			let stepback = indent;
			indent = indent + gap;
			let partial = [];
			for (let i = 0; i < value.length; i++) {
				const propertyString = serializeProperty(String(i), value);
				partial.push(propertyString !== void 0 ? propertyString : "null");
			}
			let final;
			if (partial.length === 0) final = "[]";
			else if (gap === "") final = "[" + partial.join(",") + "]";
			else {
				let separator = ",\n" + indent;
				let properties = partial.join(separator);
				final = "[\n" + indent + properties + ",\n" + stepback + "]";
			}
			stack.pop();
			indent = stepback;
			return final;
		}
	};
}));
//#endregion
//#region ../dsgraph-core/dist/json.js
var import_lib = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		parse: require_parse$1(),
		stringify: require_stringify$1()
	};
})))(), 1);
/**
* Parses JSON, falling back to JSONC (comments, trailing commas) and then JSON5 (unquoted keys,
* single quotes), which token sources such as `*.json5` files use.
*/
function parseJsonLenient(text) {
	const clean = text.charCodeAt(0) === 65279 ? text.slice(1) : text;
	try {
		return {
			value: JSON.parse(clean),
			lenient: false
		};
	} catch (strictError) {
		try {
			return {
				value: JSON.parse(stripJsonc(clean)),
				lenient: true
			};
		} catch {
			try {
				return {
					value: import_lib.default.parse(clean),
					lenient: true
				};
			} catch {
				throw strictError;
			}
		}
	}
}
function stripJsonc(text) {
	let out = "";
	let inString = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (inString) {
			out += c;
			if (c === "\\") out += text[++i] ?? "";
			else if (c === "\"") inString = false;
			continue;
		}
		if (c === "\"") {
			inString = true;
			out += c;
		} else if (c === "/" && text[i + 1] === "/") {
			while (i < text.length && text[i] !== "\n") i++;
			out += "\n";
		} else if (c === "/" && text[i + 1] === "*") {
			i += 2;
			while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
			i++;
		} else out += c;
	}
	return out.replace(/,(\s*[}\]])/g, "$1");
}
//#endregion
//#region ../dsgraph-core/dist/resolver/modes.js
const THEME_WORDS = /* @__PURE__ */ new Set(["light", "dark"]);
/** The token without `mode` in its extensions (and without empty extensions left behind). */
function withoutModes(token) {
	const { $extensions, ...rest } = token;
	if (!isPlainObject($extensions)) return token;
	const { mode: _mode, ...ext } = $extensions;
	return Object.keys(ext).length > 0 ? {
		...rest,
		$extensions: ext
	} : rest;
}
function setAt(tree, path, value) {
	let node = tree;
	for (const seg of path.slice(0, -1)) {
		if (!isPlainObject(node[seg])) node[seg] = {};
		node = node[seg];
	}
	node[path[path.length - 1]] = value;
}
/** Copies the document without `mode` extensions and collects the tokens that had them. */
function strip(tree, found, path = []) {
	if (!isPlainObject(tree)) return tree;
	if (Object.hasOwn(tree, "$value")) {
		const ext = tree.$extensions;
		if (!isPlainObject(ext) || !isPlainObject(ext.mode)) return tree;
		if (Object.keys(ext.mode).length > 1) found.push({
			path,
			token: withoutModes(tree),
			modes: ext.mode
		});
		return withoutModes(tree);
	}
	const out = {};
	for (const [k, v] of Object.entries(tree)) out[k] = k.startsWith("$") ? v : strip(v, found, [...path, k]);
	return out;
}
/**
* Modes written per token in `$extensions.mode` (`{ "light": …, "dark": … }`), as Figma variable
* exports and some build tools write them, become modifiers. Tokens that share the same mode names share a
* modifier; it is called `theme` for light and dark, otherwise after the top-level group (a Figma
* collection) its tokens live in. Systems that already have modifiers are left as they are.
*/
function expandModes(system, diag) {
	if (system.modifiers.size > 0) return system;
	const sets = /* @__PURE__ */ new Map();
	const byDoc = [];
	for (const [name, docs] of system.sets) sets.set(name, docs.map((d) => {
		const tokens = [];
		const tree = strip(d.tree, tokens);
		if (tokens.length > 0) byDoc.push({
			file: d.file,
			tokens
		});
		return {
			file: d.file,
			tree
		};
	}));
	if (byDoc.length === 0) return system;
	const signatures = /* @__PURE__ */ new Map();
	for (const { tokens } of byDoc) for (const t of tokens) {
		const modes = Object.keys(t.modes);
		signatures.set(modes.join("\0"), modes);
	}
	const larger = [...signatures.values()].sort((a, b) => b.length - a.length);
	const groups = [];
	const groupOf = (modes) => {
		let g = groups.find((x) => modes.every((m) => x.modes.includes(m)));
		if (!g) {
			g = {
				modes,
				roots: /* @__PURE__ */ new Set()
			};
			groups.push(g);
		}
		return g;
	};
	for (const modes of larger) groupOf(modes);
	const tokenGroup = /* @__PURE__ */ new Map();
	for (const { tokens } of byDoc) for (const t of tokens) {
		const g = groupOf(Object.keys(t.modes));
		g.roots.add(t.path.length > 1 ? t.path[0] : "");
		tokenGroup.set(t, g);
	}
	const out = {
		...system,
		sets,
		modifiers: /* @__PURE__ */ new Map(),
		order: [...system.order]
	};
	const names = [];
	for (const g of groups) {
		let name = g.modes.some((m) => THEME_WORDS.has(m.toLowerCase())) ? "theme" : g.roots.size === 1 && [...g.roots][0] ? [...g.roots][0] : "mode";
		for (let i = 2; names.includes(name); i++) name = `${name.replace(/-\d+$/, "")}-${i}`;
		names.push(name);
		const contexts = /* @__PURE__ */ new Map();
		for (const mode of g.modes) {
			const docs = [];
			for (const { file, tokens } of byDoc) {
				const tree = {};
				for (const t of tokens) if (tokenGroup.get(t) === g && Object.hasOwn(t.modes, mode)) setAt(tree, t.path, {
					...t.token,
					$value: t.modes[mode]
				});
				if (Object.keys(tree).length > 0) docs.push({
					file,
					tree
				});
			}
			contexts.set(mode, docs);
		}
		const def = {
			contexts,
			default: g.modes[0]
		};
		out.modifiers.set(name, def);
		out.order.push({
			kind: "modifier",
			name
		});
		diag.info("tokens/modes-from-extensions", `Modes per token: ${name} (${g.modes.join(", ")})`);
	}
	return out;
}
const stem = (file) => file.slice(file.lastIndexOf("/") + 1).replace(/\.(tokens\.json|tokens|json5?)$/i, "");
const dirOf = (file) => file.includes("/") ? file.slice(0, file.lastIndexOf("/")) : "";
function tokenIds$1(tree, path = [], out = /* @__PURE__ */ new Set()) {
	if (!isPlainObject(tree)) return out;
	if (Object.hasOwn(tree, "$value")) out.add(path.join("."));
	else for (const [k, v] of Object.entries(tree)) if (!k.startsWith("$")) tokenIds$1(v, [...path, k], out);
	return out;
}
/**
* Files side by side that define the same tokens are modes of one collection, as Figma exports
* write them (`Colors/Light.tokens.json`, `Colors/Dark.tokens.json`): one modifier per folder,
* a context per file. Undefined when no folder looks like that.
*/
function systemFromModeFiles(docs, diag) {
	const byDir = /* @__PURE__ */ new Map();
	for (const d of docs) byDir.set(dirOf(d.file), [...byDir.get(dirOf(d.file)) ?? [], d]);
	const groups = [];
	for (const [dir, list] of byDir) {
		if (list.length < 2) continue;
		const ids = list.map((d) => tokenIds$1(d.tree));
		const first = ids[0];
		if (first.size === 0) continue;
		if (ids.every((s) => {
			let common = 0;
			for (const id of s) if (first.has(id)) common++;
			return common / (s.size + first.size - common) >= .8;
		})) groups.push({
			dir,
			docs: list
		});
	}
	if (!groups.length) return void 0;
	const inGroup = new Set(groups.flatMap((g) => g.docs));
	const system = {
		sets: /* @__PURE__ */ new Map([["base", docs.filter((d) => !inGroup.has(d))]]),
		modifiers: /* @__PURE__ */ new Map(),
		order: [{
			kind: "set",
			name: "base"
		}],
		synthetic: true
	};
	for (const g of groups) {
		const contexts = g.docs.map((d) => stem(d.file));
		let name = contexts.some((c) => THEME_WORDS.has(c.toLowerCase())) ? "theme" : stem(g.dir) || "mode";
		for (let i = 2; system.modifiers.has(name); i++) name = `${name.replace(/-\d+$/, "")}-${i}`;
		const light = contexts.find((c) => c.toLowerCase() === "light");
		system.modifiers.set(name, {
			contexts: new Map(g.docs.map((d) => [stem(d.file), [d]])),
			default: light ?? contexts[0]
		});
		system.order.push({
			kind: "modifier",
			name
		});
		diag.info("tokens/mode-files", `Files in ${g.dir || "the root"} are modes of one collection: ${name} (${contexts.join(", ")})`);
	}
	return system;
}
//#endregion
//#region ../dsgraph-core/dist/resolver/resolve.js
/** Caches flattened documents across inputs. */
function createResolver(system, opts) {
	const native = system.kind !== void 0 && system.kind !== "dtcg";
	const resolveOpts = {
		strict: opts.strict,
		allowNonstandardUnits: native,
		allowNonstandardTypes: native && system.kind !== "css"
	};
	const parseDiagnostics = new DiagnosticBag();
	const flat = /* @__PURE__ */ new Map();
	const flatten = (d) => {
		let f = flat.get(d);
		if (!f) {
			f = flattenDocument(d.tree, d.file, parseDiagnostics);
			flat.set(d, f);
		}
		return f;
	};
	return {
		parseDiagnostics,
		resolve(input, diag) {
			const merged = mergeDocs(selectDocuments(system, input).map(flatten), diag);
			expandExtends(merged, diag);
			return resolveDoc(merged, diag, resolveOpts);
		}
	};
}
//#endregion
//#region ../dsgraph-core/dist/snapshot.js
const GENERATOR = "dsgraph@0.2.0";
const inputKey = (input) => canonicalize(input);
/** Builds a canonical snapshot by resolving every permutation of contexts (Resolver 2025.10). */
async function buildSnapshot(system, opts = {}) {
	const diag = opts.diagnostics ?? new DiagnosticBag();
	const modifiers = modifiersOf(system);
	const all = enumerateInputs(modifiers);
	const max = opts.maxPermutations ?? 64;
	const def = defaultInput(modifiers, opts.defaultInput);
	const partial = all.length > max;
	let inputs = all;
	if (partial) {
		diag.warn("resolver/too-many-permutations", `${all.length} permutations exceed the limit of ${max}; resolving defaults plus one modifier at a time`);
		const seen = /* @__PURE__ */ new Map([[inputKey(def), def]]);
		for (const m of modifiers) for (const c of m.contexts) {
			const i = {
				...def,
				[m.name]: c
			};
			seen.set(inputKey(i), i);
		}
		inputs = [...seen.values()];
	}
	if (modifiers.some((m) => m.default === void 0) && !opts.defaultInput) diag.info("resolver/no-default", "Some modifiers have no default; the first context is used as default");
	const resolver = createResolver(system, { strict: opts.strict ?? false });
	const results = inputs.map((input) => ({
		input,
		doc: resolver.resolve(input, diag)
	}));
	diag.merge(resolver.parseDiagnostics);
	const defaultResult = results.find((r) => inputKey(r.input) === inputKey(def)) ?? results[0];
	const ids = /* @__PURE__ */ new Set();
	for (const r of results) for (const id of r.doc.tokens.keys()) ids.add(id);
	const tokens = [];
	const edges = [];
	for (const id of [...ids].sort()) {
		const perInput = results.map((r) => ({
			input: r.input,
			token: r.doc.tokens.get(id)
		}));
		const signature = (t) => t ? canonicalize({
			raw: t.raw,
			value: t.value,
			refs: t.refs,
			type: t.type
		}) : "∅";
		const names = modifiers.filter((m) => {
			const groups = /* @__PURE__ */ new Map();
			for (const p of perInput) {
				const rest = canonicalize({
					...p.input,
					[m.name]: void 0
				});
				const set = groups.get(rest) ?? /* @__PURE__ */ new Set();
				set.add(signature(p.token));
				groups.set(rest, set);
			}
			return [...groups.values()].some((s) => s.size > 1);
		}).map((m) => m.name);
		const values = /* @__PURE__ */ new Map();
		let missingSomewhere = false;
		for (const p of perInput) {
			if (!p.token) {
				missingSomewhere = true;
				continue;
			}
			const when = {};
			for (const n of names) when[n] = p.input[n];
			const key = canonicalize(when);
			if (!values.has(key)) values.set(key, {
				when,
				raw: p.token.raw,
				value: p.token.value,
				refs: p.token.refs
			});
		}
		const meta = defaultResult.doc.tokens.get(id) ?? perInput.find((p) => p.token).token;
		if (missingSomewhere) diag.warn("resolver/token-missing-in-context", `Token "${id}" is not defined in every context`, meta.origin);
		const token = {
			id,
			path: meta.path,
			type: meta.type,
			typeSource: meta.typeSource,
			layer: layerOf(id, opts.layers),
			deprecated: meta.deprecated,
			values: [...values.values()].sort((a, b) => canonicalize(a.when).localeCompare(canonicalize(b.when))),
			origin: meta.origin,
			inheritedFrom: meta.inheritedFrom,
			flags: meta.flags
		};
		if (meta.description !== void 0) token.description = meta.description;
		if (meta.extensions !== void 0) token.extensions = meta.extensions;
		tokens.push(token);
		const refKeys = /* @__PURE__ */ new Map();
		for (const v of token.values) for (const ref of v.refs) {
			const k = canonicalize(ref);
			const e = refKeys.get(k) ?? {
				ref,
				whens: []
			};
			e.whens.push(v.when);
			refKeys.set(k, e);
		}
		for (const { ref, whens } of refKeys.values()) {
			const attrs = {};
			if (ref.property) attrs.property = ref.property;
			if (ref.targetPath) attrs.targetPath = ref.targetPath;
			if (whens.length === token.values.length && !missingSomewhere) edges.push(Object.keys(attrs).length ? [
				"aliases",
				id,
				ref.to,
				attrs
			] : [
				"aliases",
				id,
				ref.to
			]);
			else for (const when of whens) edges.push([
				"aliases",
				id,
				ref.to,
				{
					...attrs,
					when
				}
			]);
		}
		if (token.deprecated?.replacement) edges.push([
			"deprecated_by",
			id,
			token.deprecated.replacement
		]);
	}
	const groups = defaultResult.doc.groups;
	for (const g of groups) if (g.extends) edges.push([
		"extends",
		g.id,
		g.extends
	]);
	const lower = /* @__PURE__ */ new Map();
	for (const t of tokens) {
		const k = t.id.toLowerCase();
		const other = lower.get(k);
		if (other) diag.warn("naming/case-collision", `"${t.id}" and "${other}" differ only by case`, t.origin);
		else lower.set(k, t.id);
	}
	edges.sort((a, b) => canonicalize(a).localeCompare(canonicalize(b)));
	const snapshot = {
		schema: SNAPSHOT_SCHEMA,
		source: opts.source ?? { kind: "files" },
		contexts: {
			modifiers,
			permutations: all.length,
			partial
		},
		nodes: {
			groups,
			tokens
		},
		edges,
		diagnostics: diag.list(),
		hash: "",
		meta: {
			generator: GENERATOR,
			...opts.meta
		}
	};
	snapshot.hash = await contentHash(snapshot);
	return snapshot;
}
function layerOf(id, layers) {
	if (!layers) return null;
	for (const [name, layer] of Object.entries(layers)) if (layer.match.some((p) => matchPath(id, p))) return name;
	return null;
}
//#endregion
//#region ../dsgraph-core/dist/source.js
/**
* Starts reading files several at a time, so the sequential reads that follow hit a source's
* cache instead of waiting on the network one file after another. Errors surface on the later read.
*/
async function prefetch(source, paths, concurrency = 16) {
	let next = 0;
	const worker = async () => {
		while (next < paths.length) {
			const path = paths[next++];
			await source.readText(path).catch(() => void 0);
		}
	};
	await Promise.all(Array.from({ length: Math.min(concurrency, paths.length) }, worker));
}
//#endregion
//#region ../dsgraph-core/dist/scan.js
const DEFAULT_INCLUDE = ["**/*.tokens.json", "**/*.tokens"];
const ALWAYS_EXCLUDE = ["**/node_modules/**", "**/.git/**"];
const BUILD_OUTPUT = ["**/dist/**"];
[...ALWAYS_EXCLUDE, ...BUILD_OUTPUT];
/**
* Paths a section (`tokens` or `css`) skips. Build output is skipped only when looking on our
* own: files named in `include` are read wherever they are.
*/
function excludeFor(config, section) {
	const own = config[section];
	const skipBuild = !own?.include && !config.includeBuild;
	return [
		...ALWAYS_EXCLUDE,
		...skipBuild ? BUILD_OUTPUT : [],
		...own?.exclude ?? []
	];
}
/** JSON files that are never token files, skipped when looking through all `*.json`. */
const NOT_TOKENS = /(^|\/)(package(-lock)?|tsconfig[\w.-]*|jsconfig|composer|lerna|nx|project|turbo|vercel|biome|renovate|manifest|\.?[\w-]*rc|[\w.-]*\.schema|[\w.-]*\.resolver|dsgraph\.config)\.json$/i;
/**
* Loads a token system. Precedence: a resolver document, then DTCG token files, then adapters.
* When only `css` is configured, adapters come before DTCG files.
*/
async function loadSystem(source, config, diag, opts = {}) {
	const exclude = excludeFor(config, "tokens");
	const notExcluded = (p) => !matchGlob(p, exclude);
	const readJson = async (path) => {
		const { value, lenient } = parseJsonLenient(await source.readText(path));
		if (lenient) diag.info("tokens/non-json", "File uses JSONC or JSON5 syntax", { file: path });
		return value;
	};
	const fromAdapters = async (priority) => {
		for (const adapter of opts.adapters ?? []) {
			if ((adapter.priority ?? "fallback") !== priority) continue;
			const files = await adapter.detect(source, config);
			if (files.length > 0) return expandModes(await adapter.load(source, files, config, diag), diag);
		}
	};
	let resolverPath = config.tokens?.resolver;
	if (!resolverPath) {
		const found = (await source.list("**/*.resolver.json")).filter(notExcluded).sort();
		if (found.length > 1) diag.warn("tokens/multiple-resolvers", `Found ${found.length} resolver documents; using "${found[0]}"`);
		resolverPath = found[0];
	}
	if (resolverPath) {
		let tree;
		try {
			tree = await readJson(resolverPath);
		} catch (e) {
			diag.error("tokens/invalid-json", e.message, { file: resolverPath });
			return systemFromDocuments([]);
		}
		return systemFromResolver(tree, resolverPath, readJson, diag);
	}
	if (config.css && !config.tokens) {
		const sys = await fromAdapters("fallback");
		if (sys) return sys;
	}
	const first = await fromAdapters("first");
	if (first) return first;
	let files = (await source.list(config.tokens?.include ?? DEFAULT_INCLUDE)).filter(notExcluded);
	if (files.length === 0 && !config.tokens?.include) {
		const json = (await source.list(["**/*.json", "**/*.json5"])).filter((p) => notExcluded(p) && !NOT_TOKENS.test(p));
		files = [];
		await prefetch(source, json.slice(0, 2e3));
		for (const p of json.slice(0, 2e3)) if (/["']?\$value["']?\s*:/.test(await source.readText(p))) files.push(p);
	}
	if (files.length === 0) {
		const sys = await fromAdapters("fallback");
		if (sys) return sys;
		diag.warn("tokens/no-files", "No token files found");
	}
	const order = config.tokens?.order ?? [];
	const rank = (p) => {
		const i = order.findIndex((g) => matchGlob(p, g));
		return i < 0 ? order.length : i;
	};
	files.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
	const docs = [];
	await prefetch(source, files);
	for (const file of files) try {
		docs.push({
			file,
			tree: await readJson(file)
		});
	} catch (e) {
		diag.error("tokens/invalid-json", e.message, { file });
	}
	return expandModes(systemFromModeFiles(docs, diag) ?? systemFromDocuments(docs), diag);
}
const isEmpty = (s) => [...s.sets.values()].every((d) => d.length === 0) && [...s.modifiers.values()].every((m) => [...m.contexts.values()].every((d) => d.length === 0));
/** Scans a source into a snapshot. */
async function scan(source, config = {}, opts = {}) {
	let diagnostics = new DiagnosticBag();
	let system = await loadSystem(source, config, diagnostics, opts);
	if (!(config.tokens?.include || config.tokens?.resolver || config.css?.include) && isEmpty(system)) {
		const retry = new DiagnosticBag();
		const built = await loadSystem(source, {
			...config,
			includeBuild: true
		}, retry, opts);
		if (!isEmpty(built)) {
			retry.info("tokens/build-output", "No token sources outside dist/; read the build output");
			system = built;
			diagnostics = retry;
		}
	}
	const build = {
		source: await source.meta(),
		strict: config.tokens?.strict ?? false,
		diagnostics
	};
	if (config.layers) build.layers = config.layers;
	if (config.contexts?.default) build.defaultInput = config.contexts.default;
	if (config.contexts?.maxPermutations) build.maxPermutations = config.contexts.maxPermutations;
	return buildSnapshot(system, build);
}
//#endregion
//#region ../dsgraph-report/dist/values.js
const isObj$2 = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const plain = (value) => typeof value === "string" || typeof value === "number" ? String(value) : JSON.stringify(value);
/**
* Short human-readable form of a canonical value. Never throws: a value that does not have the
* shape of its type (a source error) is shown as it is.
*/
function formatValue(type, value) {
	try {
		return formatTyped(type, value);
	} catch {
		return plain(value);
	}
}
function formatTyped(type, value) {
	if (value === null || value === void 0) return "—";
	switch (type) {
		case "color": {
			if (!isObj$2(value) || !Array.isArray(value.components)) return plain(value);
			const c = value;
			const hex = colorToHex(c);
			const alpha = c.alpha < 1 ? ` ${Math.round(c.alpha * 100)}%` : "";
			return c.space === "srgb" ? `${hex}${alpha}` : `${hex}${alpha} (${c.space})`;
		}
		case "dimension":
		case "duration": {
			const d = value;
			return `${d.value}${d.unit}`;
		}
		case "fontFamily": return value.join(", ");
		case "cubicBezier": return `cubic-bezier(${value.join(", ")})`;
		case "shadow": return value.map((l) => [
			l.inset ? "inset" : "",
			...[
				"offsetX",
				"offsetY",
				"blur",
				"spread"
			].map((k) => formatValue("dimension", l[k])),
			formatValue("color", l.color)
		].filter(Boolean).join(" ")).join(", ");
		case "border": {
			const b = value;
			return `${formatValue("dimension", b.width)} ${typeof b.style === "string" ? b.style : "dashed"} ${formatValue("color", b.color)}`;
		}
		case "typography": {
			const t = value;
			return `${formatValue("fontWeight", t.fontWeight)} ${formatValue("dimension", t.fontSize)}/${t.lineHeight ?? "—"} ${formatValue("fontFamily", t.fontFamily)}`;
		}
		default: return plain(value);
	}
}
/** Value of a changeset side (`{ raw, value }`) with the alias it came from, if any. */
function formatSide(type, side) {
	if (!isObj$2(side)) return formatValue(type, side);
	return `${formatValue(type, side.value)}${typeof side.raw === "string" && /^\{[^{}]+\}$/.test(side.raw) ? ` ← ${side.raw}` : ""}`;
}
function formatDelta(delta) {
	if (!delta) return "";
	const parts = [];
	if (typeof delta.deltaEOK === "number") parts.push(`ΔE ${delta.deltaEOK}`);
	if (typeof delta.deltaAlpha === "number") parts.push(`α ${delta.deltaAlpha > 0 ? "+" : ""}${delta.deltaAlpha}`);
	if (typeof delta.px === "number") parts.push(`${delta.px > 0 ? "+" : ""}${delta.px}px`);
	if (typeof delta.ms === "number") parts.push(`${delta.ms > 0 ? "+" : ""}${delta.ms}ms`);
	if (typeof delta.by === "number") parts.push(`${delta.by > 0 ? "+" : ""}${delta.by}`);
	if (Array.isArray(delta.fields)) parts.push(`changed: ${delta.fields.join(", ")}`);
	for (const [k, one] of [["layers", "layer"], ["stops", "stop"]]) {
		const d = delta[k];
		if (Array.isArray(d)) parts.push(`${d.length === 1 ? one : k} ${d.map((i) => Number(i) + 1).join(", ")}`);
		else if (d !== void 0) parts.push(`${k}: ${String(d)}`);
	}
	if (delta.unit !== void 0) parts.push(`unit: ${String(delta.unit)}`);
	return parts.join(", ");
}
function formatSource(s) {
	if (s.kind === "npm") return `npm:${s.package}@${s.version}`;
	if (s.kind === "github") return `github:${s.repo}@${s.ref}${s.commit ? ` (${s.commit.slice(0, 7)})` : ""}${s.path ? `/${s.path}` : ""}`;
	if (s.path) return s.path;
	return s.kind;
}
const formatWhen = (when) => when && Object.keys(when).length > 0 ? ` (${Object.entries(when).map(([k, v]) => `${k}: ${v}`).join(", ")})` : "";
//#endregion
//#region ../dsgraph-report/dist/changeset.js
const LEVEL_TITLE = {
	major: "Breaking (major)",
	minor: "Minor",
	patch: "Patch",
	none: "No impact"
};
const typeOf = (c) => {
	const side = c.after ?? c.before;
	if (side && typeof side === "object" && "type" in side) return side.type ?? null;
	return null;
};
/** One line describing a change; `type` comes from the head token when known. */
function describe(c, types, code) {
	const t = types.get(c.target) ?? typeOf(c);
	const where = formatWhen(c.when);
	switch (c.kind) {
		case "token.added": return `added ${code(c.target)}`;
		case "token.removed": {
			const maybe = c.possibleRenames?.length ? ` — possibly renamed to ${c.possibleRenames.map(code).join(" or ")}` : "";
			return `removed ${code(c.target)}${maybe}`;
		}
		case "token.renamed": return `renamed ${code(c.from ?? "?")} → ${code(c.target)}${c.confidence < .8 ? ` (likely, ${Math.round(c.confidence * 100)}%)` : ""}`;
		case "token.value-changed": {
			const delta = formatDelta(c.delta);
			return `${code(c.target)}${where}: ${formatSide(t, c.before)} → ${formatSide(t, c.after)}${delta ? ` (${delta})` : ""}`;
		}
		case "token.notation-changed": return `${code(c.target)}${where}: same value, written differently`;
		case "token.alias-retargeted": return `${code(c.target)}${where}: now ${formatSide(t, c.after)}, same value`;
		case "token.type-changed": return `${code(c.target)}: type ${String(c.before)} → ${String(c.after)}`;
		case "token.missing-in-context": return `${code(c.target)} is no longer defined${where}`;
		case "token.contexts-changed": return `${code(c.target)}: depends on ${JSON.stringify(c.before)} → ${JSON.stringify(c.after)}`;
		case "token.deprecated": {
			const d = c.after;
			return `deprecated ${code(c.target)}${d?.replacement ? ` — use ${code(d.replacement)}` : d?.reason ? ` — ${d.reason}` : ""}`;
		}
		case "token.undeprecated": return `no longer deprecated ${code(c.target)}`;
		case "token.description-changed": return `${code(c.target)}: description changed`;
		case "token.extensions-changed": return `${code(c.target)}: $extensions changed`;
		case "group.extends-changed": return `group ${code(c.target)}: $extends ${String(c.before ?? "—")} → ${String(c.after ?? "—")}`;
		case "context.added":
		case "context.removed": return `${c.kind === "context.added" ? "added" : "removed"} context ${code(c.target)}`;
		case "modifier.added":
		case "modifier.removed": return `${c.kind === "modifier.added" ? "added" : "removed"} modifier ${code(c.target)}`;
		default: return `${c.kind} ${code(c.target)}`;
	}
}
/** Formats a changeset. Propagated value changes are listed under the direct change that caused them. */
function formatChangeset(cs, opts = {}) {
	const format = opts.format ?? "text";
	if (format === "json") return `${JSON.stringify(cs, null, 2)}\n`;
	const md = format === "markdown";
	const code = (s) => md ? `\`${s}\`` : s;
	const types = opts.types ?? /* @__PURE__ */ new Map();
	const max = opts.maxPropagated ?? 5;
	const propagatedBy = /* @__PURE__ */ new Map();
	for (const c of cs.changes) for (const cause of c.cause) propagatedBy.set(cause, [...propagatedBy.get(cause) ?? [], c]);
	const shown = cs.changes.filter((c) => !(c.origin === "propagated" && c.cause.length > 0));
	const counts = cs.summary.counts;
	const summary = [
		counts.removed ? `${counts.removed} removed` : "",
		counts.renamed ? `${counts.renamed} renamed` : "",
		counts.changed ? `${counts.changed} changed${counts.propagated ? ` (+${counts.propagated} through references)` : ""}` : "",
		counts.added ? `${counts.added} added` : "",
		counts.deprecated ? `${counts.deprecated} deprecated` : ""
	].filter(Boolean);
	const lines = [];
	const title = cs.changes.length === 0 ? "no changes" : `suggested bump: ${cs.summary.level}`;
	if (md) {
		lines.push(`## dsgraph diff — ${title}`, "");
		lines.push(`${formatSource(cs.base.source)} → ${formatSource(cs.head.source)}`, "");
		if (summary.length) lines.push(`**${summary.join(" · ")}**`, "");
	} else {
		lines.push(`dsgraph diff — ${title}`, `${formatSource(cs.base.source)} → ${formatSource(cs.head.source)}`);
		if (summary.length) lines.push(summary.join(" · "));
		lines.push("");
	}
	for (const level of [
		"major",
		"minor",
		"patch",
		"none"
	]) {
		const group = shown.filter((c) => c.level === level);
		if (group.length === 0) continue;
		const collapsible = md && (level === "patch" || level === "none");
		if (collapsible) lines.push(`<details><summary>${LEVEL_TITLE[level]} (${group.length})</summary>`, "");
		else lines.push(md ? `### ${LEVEL_TITLE[level]} (${group.length})` : `${LEVEL_TITLE[level]} (${group.length})`, "");
		for (const c of group) {
			lines.push(`${md ? "- " : "  "}${describe(c, types, code)}`);
			const via = propagatedBy.get(c.id);
			if (via?.length) {
				const names = [...new Set(via.map((p) => p.target))];
				const listed = names.slice(0, max).map(code).join(", ");
				lines.push(`${md ? "  - " : "      "}affects ${listed}${names.length > max ? ` and ${names.length - max} more` : ""}`);
			}
		}
		lines.push("");
		if (collapsible) lines.push("</details>", "");
	}
	if (cs.contexts.partial) lines.push(md ? "> Some contexts were not fully compared (too many permutations)." : "Note: some contexts were not fully compared.", "");
	return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}
//#endregion
//#region ../dsgraph-report/dist/findings.js
const ICON = {
	error: "✖",
	warning: "▲",
	info: "•"
};
const QUOTED = /"[^"]*"/g;
/** What differs between repeated messages: quoted values and numbers (`steps 0 and 1`). */
const VARIABLE = /"[^"]*"|\b\d+(?:\.\d+)?\b/g;
const mask = (part) => part.startsWith("\"") ? "\"…\"" : "…";
/** Groups repeated findings: same rule, same severity, same message up to quoted values and numbers. Order is kept. */
function groupFindings(findings) {
	const groups = /* @__PURE__ */ new Map();
	for (const f of findings) {
		const pattern = f.message.replace(VARIABLE, mask);
		const key = `${f.severity}\u0000${f.rule}\u0000${pattern}`;
		const g = groups.get(key);
		if (g) g.findings.push(f);
		else groups.set(key, {
			rule: f.rule,
			severity: f.severity,
			pattern,
			findings: [f]
		});
	}
	for (const g of groups.values()) {
		g.pattern = restoreShared(g.findings.map((f) => f.message));
		const files = new Set(g.findings.map((f) => f.loc?.file));
		const [file] = files;
		if (files.size === 1 && file) g.file = file;
	}
	return [...groups.values()];
}
/** Masks only the values that differ between messages; a shared one stays (`use "px"`, `2025.10`). */
function restoreShared(messages) {
	const parts = messages.map((m) => m.match(VARIABLE) ?? []);
	let i = 0;
	return messages[0].replace(VARIABLE, (q) => {
		const k = i++;
		return parts.every((ps) => ps[k] === q) ? q : mask(q);
	});
}
/** What tells one finding of a group from another: its token, else the quoted values of its message. */
function findingLabel(f) {
	return `${f.nodes[0] ?? f.message.match(QUOTED)?.join(" ") ?? f.message}${formatWhen(f.when)}`;
}
const summaryOf = (findings) => {
	const counts = {
		error: 0,
		warning: 0,
		info: 0
	};
	for (const f of findings) counts[f.severity]++;
	return `${counts.error} errors · ${counts.warning} warnings · ${counts.info} info`;
};
const cell = (s) => s.replace(/\|/g, "\\|");
function formatFindings(findings, opts = {}) {
	const format = opts.format ?? "text";
	if (format === "json") return `${JSON.stringify(findings, null, 2)}\n`;
	const grouped = opts.group ?? true;
	const md = format === "markdown";
	if (findings.length === 0) return md ? "## dsgraph check — no findings\n" : "dsgraph check — no findings\n";
	const summary = summaryOf(findings);
	if (md) {
		if (!grouped) return `## dsgraph check — ${summary}\n\n| | Rule | Finding | File |\n|---|---|---|---|\n${findings.map((f) => `| ${ICON[f.severity]} ${f.severity} | \`${f.rule}\` | ${cell(f.message)}${formatWhen(f.when)} | ${f.loc?.file ? `\`${f.loc.file}\`` : ""} |`).join("\n")}\n`;
		const groups = groupFindings(findings);
		const max = opts.maxListed ?? 50;
		const rows = groups.map((g) => `| ${ICON[g.severity]} ${g.severity} | \`${g.rule}\` | ${g.findings.length} | ${cell(g.pattern)}${g.findings.length === 1 ? formatWhen(g.findings[0].when) : ""} | ${g.file ? `\`${g.file}\`` : ""} |`);
		const details = groups.filter((g) => g.findings.length > 1).map((g) => {
			const items = g.findings.slice(0, max).map((f) => `- ${cell(f.message)}${formatWhen(f.when)}${f.nodes[0] ? ` — \`${f.nodes[0]}\`` : ""}`);
			if (g.findings.length > max) items.push(`- … and ${g.findings.length - max} more`);
			return `<details><summary>${ICON[g.severity]} <code>${g.rule}</code> — ${g.findings.length} × ${escapeHtml(g.pattern)}</summary>\n\n${items.join("\n")}\n\n</details>`;
		});
		return `## dsgraph check — ${summary}\n\n| | Rule | Count | Finding | File |\n|---|---|---|---|---|\n${rows.join("\n")}\n${details.length ? `\n${details.join("\n\n")}\n` : ""}`;
	}
	const line = (severity, rule, text) => `${ICON[severity]} ${severity.padEnd(7)} ${rule.padEnd(30)} ${text}`;
	if (!grouped) return `dsgraph check — ${summary}\n\n${findings.map((f) => line(f.severity, f.rule, `${f.message}${formatWhen(f.when)}${f.loc?.file ? `  (${f.loc.file})` : ""}`)).join("\n")}\n`;
	const examples = opts.examples ?? 3;
	const indent = " ".repeat(41);
	const lines = [];
	for (const g of groupFindings(findings)) {
		const n = g.findings.length;
		const file = g.file ? `  (${g.file})` : "";
		if (n === 1) {
			const f = g.findings[0];
			lines.push(line(f.severity, f.rule, `${f.message}${formatWhen(f.when)}${f.loc?.file ? `  (${f.loc.file})` : ""}`));
			continue;
		}
		lines.push(line(g.severity, g.rule, `${n}× ${g.pattern}${file}`));
		const labels = g.findings.slice(0, examples).map(findingLabel);
		lines.push(`${indent}${labels.join(", ")}${n > examples ? `, … and ${n - examples} more` : ""}`);
	}
	return `dsgraph check — ${summary}\n\n${lines.join("\n")}\n`;
}
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//#endregion
//#region ../dsgraph-rules/dist/presets.js
/** Presets follow architecture patterns only — never specific design systems (neutrality principle). */
const PRESETS = {
	/** Sensible defaults; equal to the rules' default severities. */
	recommended: {
		"token/deprecated-reference": "warning",
		"naming/normalized-collision": "warning",
		"color/hex-mismatch": "warning",
		"color/out-of-gamut": "info",
		"palette/non-monotonic": "warning",
		"palette/duplicate-stops": "warning"
	},
	/** Only what DTCG 2025.10 requires: legacy syntax and non-standard values become errors. */
	"dtcg-strict": {
		"dtcg/legacy-syntax": "error",
		"dtcg/invalid-unit": "error",
		"dtcg/invalid-font-weight": "error",
		"dtcg/unknown-type": "error",
		"dtcg/typography-missing-field": "error",
		"tokens/non-json": "error"
	},
	/** Two layers: `core` holds raw values and aliases nothing; `semantic` references `core` directly. */
	"two-layer": {
		"layer/allowed-sources": ["warning", { allow: {
			core: [],
			semantic: ["core", "semantic"]
		} }],
		"layer/alias-depth": ["warning", {
			layer: "semantic",
			max: 0
		}]
	}
};
//#endregion
//#region ../dsgraph-rules/dist/rules/layers.js
/** Whole-value alias targets of a token across all its contexts. */
function wholeTargets(graph, id) {
	const t = graph.token(id);
	if (!t) return [];
	return [...new Set(t.values.flatMap((v) => v.refs.filter((r) => !r.property && !r.targetPath).map((r) => r.to)))];
}
const aliasDepth = {
	id: "layer/alias-depth",
	description: "Tokens of a layer reference tokens of the same layer deeper than allowed.",
	defaultSeverity: "off",
	run({ graph, options, report }) {
		const layer = typeof options.layer === "string" ? options.layer : "semantic";
		const max = typeof options.max === "number" ? options.max : 0;
		const allow = (Array.isArray(options.allow) ? options.allow : []).filter((a) => typeof a === "string").map((a) => a.split("->").map((s) => s.trim()));
		const allowed = (from, to) => allow.some(([f, t]) => matchPath(from, f) && matchPath(to, t));
		const memo = /* @__PURE__ */ new Map();
		const depth = (id, seen) => {
			if (memo.has(id)) return memo.get(id);
			let d = 0;
			for (const to of wholeTargets(graph, id)) {
				if (graph.token(to)?.layer !== layer || seen.has(to) || allowed(id, to)) continue;
				d = Math.max(d, 1 + depth(to, /* @__PURE__ */ new Set([...seen, to])));
			}
			memo.set(id, d);
			return d;
		};
		for (const t of graph.tokens({ layer })) {
			const d = depth(t.id, /* @__PURE__ */ new Set([t.id]));
			if (d > max) report({
				message: `"${t.id}" goes through ${d} ${layer} alias${d > 1 ? "es" : ""} (max ${max})`,
				nodes: [t.id, ...wholeTargets(graph, t.id)],
				evidence: {
					depth: d,
					max,
					chain: graph.chain(t.id)
				},
				token: t
			});
		}
	}
};
const allowedSources = {
	id: "layer/allowed-sources",
	description: "Tokens of a layer reference only the layers allowed for it.",
	defaultSeverity: "off",
	run({ graph, options, report }) {
		const allow = options.allow ?? {};
		for (const [, from, to] of graph.edges("aliases")) {
			const source = graph.token(from);
			const target = graph.token(to);
			const fromLayer = source?.layer;
			if (!source || !target || !fromLayer || !(fromLayer in allow)) continue;
			const permitted = Array.isArray(allow[fromLayer]) ? allow[fromLayer] : [];
			if (!permitted.includes(target.layer ?? "")) report({
				message: `"${from}" (${fromLayer}) references "${to}" (${target.layer ?? "no layer"}); ${fromLayer} may reference ${permitted.length ? permitted.join(", ") : "nothing"}`,
				nodes: [from, to],
				evidence: {
					fromLayer,
					toLayer: target.layer,
					allowed: permitted
				},
				token: source
			});
		}
	}
};
//#endregion
//#region ../dsgraph-rules/dist/color.js
const toRgb = converter("rgb");
/** sRGB channels (0–1, clamped) and alpha of a canonical color value. */
function rgba(c) {
	const rgb = toRgb(toCulori(c));
	const clamp = (v) => Math.min(1, Math.max(0, v ?? 0));
	return [
		clamp(rgb.r),
		clamp(rgb.g),
		clamp(rgb.b),
		c.alpha
	];
}
/** Composites `top` over an opaque `bottom`. */
function over(top, bottom) {
	return [
		0,
		1,
		2
	].map((i) => top[i] * top[3] + bottom[i] * (1 - top[3]));
}
function luminance([r, g, b]) {
	const lin = (v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
	return .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
}
/** WCAG 2.x contrast ratio of text over a surface; translucent surfaces sit on white. */
function contrastRatio(text, surface) {
	const bg = over(rgba(surface), [
		1,
		1,
		1
	]);
	const [l1, l2] = [luminance(over(rgba(text), bg)), luminance(bg)].sort((a, b) => b - a);
	return (l1 + .05) / (l2 + .05);
}
//#endregion
//#region ../dsgraph-rules/dist/rules/tokens.js
const asArray = (v) => Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
const deprecatedReference = {
	id: "token/deprecated-reference",
	description: "A token references a deprecated token.",
	defaultSeverity: "warning",
	run({ graph, report }) {
		for (const [, from, to] of graph.edges("aliases")) {
			const source = graph.token(from);
			const target = graph.token(to);
			if (!source || !target?.deprecated || source.deprecated) continue;
			const replacement = target.deprecated.replacement;
			report({
				message: `"${from}" references deprecated "${to}"${replacement ? `; use "${replacement}"` : ""}`,
				nodes: [from, to],
				evidence: {
					reason: target.deprecated.reason,
					replacement
				},
				token: source
			});
		}
	}
};
const normalizedCollision = {
	id: "naming/normalized-collision",
	description: "Different tokens map to the same name in code (CSS, Figma) after normalization.",
	defaultSeverity: "warning",
	run({ graph, report }) {
		const byName = /* @__PURE__ */ new Map();
		for (const t of graph.tokens()) {
			const n = normalizeName(t.id);
			byName.set(n, [...byName.get(n) ?? [], t.id]);
		}
		for (const [name, ids] of byName) if (ids.length > 1) report({
			message: `${ids.map((i) => `"${i}"`).join(", ")} all normalize to "${name}"`,
			nodes: ids,
			evidence: { name }
		});
	}
};
const hexMismatch = {
	id: "color/hex-mismatch",
	description: "The hex fallback of a color does not match its components.",
	defaultSeverity: "warning",
	run({ graph, report }) {
		for (const t of graph.tokens({ type: "color" })) for (const v of t.values) {
			const c = v.value;
			if (!c?.hex) continue;
			const actual = colorToHex(c);
			if ([
				1,
				3,
				5
			].some((i) => Math.abs(Number.parseInt(actual.slice(i, i + 2), 16) - Number.parseInt(c.hex.slice(i, i + 2), 16)) > 1)) report({
				message: `"${t.id}": hex ${c.hex} does not match the color (${actual})`,
				nodes: [t.id],
				evidence: {
					hex: c.hex,
					computed: actual
				},
				when: v.when,
				token: t
			});
		}
	}
};
const outOfGamut = {
	id: "color/out-of-gamut",
	description: "A wide-gamut color is outside sRGB and has no hex fallback.",
	defaultSeverity: "info",
	run({ graph, report }) {
		for (const t of graph.tokens({ type: "color" })) for (const v of t.values) {
			const c = v.value;
			if (c && !c.hex && !isInSrgbGamut(c)) report({
				message: `"${t.id}" is outside sRGB; add a hex fallback for sRGB targets`,
				nodes: [t.id],
				evidence: { space: c.space },
				when: v.when,
				token: t
			});
		}
	}
};
/** Color ramps: siblings whose last name segment is a number (`blue.100`, `blue-500`), at least 3 stops. */
function ramps(graph) {
	const groups = /* @__PURE__ */ new Map();
	for (const t of graph.tokens({ type: "color" })) {
		const segs = normalizeName(t.id).split(".");
		const step = Number(segs.at(-1));
		if (segs.length < 2 || !/^\d+$/.test(segs.at(-1)) || !Number.isFinite(step)) continue;
		const key = segs.slice(0, -1).join(".");
		groups.set(key, [...groups.get(key) ?? [], {
			id: t.id,
			step
		}]);
	}
	return [...groups].filter(([, stops]) => stops.length >= 3).map(([name, stops]) => ({
		name,
		stops: stops.sort((a, b) => a.step - b.step)
	}));
}
//#endregion
//#region ../dsgraph-rules/dist/check.js
const RULES = [
	deprecatedReference,
	normalizedCollision,
	hexMismatch,
	outOfGamut,
	{
		id: "palette/non-monotonic",
		description: "Lightness of a numeric color ramp does not change in one direction.",
		defaultSeverity: "warning",
		run({ graph, report }) {
			for (const { name, stops } of ramps(graph)) {
				const l = stops.map((s) => {
					const v = graph.value(s.id);
					return v ? toOklab(v)[0] : NaN;
				});
				const dir = Math.sign(l.at(-1) - l[0]);
				for (let i = 1; i < stops.length; i++) {
					const step = l[i] - l[i - 1];
					if (Number.isNaN(step) || Math.abs(step) < 1e-4) continue;
					if (Math.sign(step) !== dir) report({
						message: `Ramp "${name}": lightness goes the wrong way from ${stops[i - 1].step} to ${stops[i].step}`,
						nodes: [stops[i - 1].id, stops[i].id],
						evidence: {
							ramp: name,
							from: Math.round(l[i - 1] * 1e3) / 1e3,
							to: Math.round(l[i] * 1e3) / 1e3
						}
					});
				}
			}
		}
	},
	{
		id: "palette/duplicate-stops",
		description: "Two steps of a numeric color ramp have the same color.",
		defaultSeverity: "warning",
		run({ graph, report }) {
			for (const { name, stops } of ramps(graph)) for (let i = 1; i < stops.length; i++) {
				const a = graph.value(stops[i - 1].id);
				const b = graph.value(stops[i].id);
				if (a && b && compareValues("color", a, b).result !== "changed") report({
					message: `Ramp "${name}": steps ${stops[i - 1].step} and ${stops[i].step} are the same color`,
					nodes: [stops[i - 1].id, stops[i].id],
					evidence: { ramp: name }
				});
			}
		}
	},
	{
		id: "a11y/contrast-matrix",
		description: "Every text role over every surface role meets the minimum WCAG contrast in every context.",
		defaultSeverity: "off",
		run({ graph, options, report }) {
			const text = asArray(options.text);
			const surfaces = asArray(options.surfaces);
			const min = typeof options.min === "number" ? options.min : 4.5;
			const acknowledged = new Set(asArray(options.acknowledged));
			if (text.length === 0 || surfaces.length === 0) return;
			const textTokens = graph.tokens({ type: "color" }).filter((t) => text.some((p) => matchPath(t.id, p)));
			const surfaceTokens = graph.tokens({ type: "color" }).filter((t) => surfaces.some((p) => matchPath(t.id, p)));
			const inputs = graph.inputs().slice(0, 64);
			for (const fg of textTokens) for (const bg of surfaceTokens) {
				if (fg.id === bg.id) continue;
				const failing = /* @__PURE__ */ new Map();
				for (const input of inputs) {
					const f = graph.value(fg.id, input);
					const b = graph.value(bg.id, input);
					if (!f || !b) continue;
					const ratio = Math.round(contrastRatio(f, b) * 100) / 100;
					if (ratio < min) failing.set(JSON.stringify(input), {
						when: input,
						ratio
					});
				}
				if (failing.size === 0) continue;
				const pair = `${fg.id} × ${bg.id}`;
				const worst = [...failing.values()].sort((a, b) => a.ratio - b.ratio)[0];
				const all = failing.size === inputs.length;
				const finding = {
					message: `${pair}: contrast ${worst.ratio} is below ${min}${all ? "" : ` in ${failing.size} of ${inputs.length} contexts`}`,
					nodes: [fg.id, bg.id],
					evidence: {
						ratio: worst.ratio,
						min,
						contexts: [...failing.values()].map((f) => f.when)
					},
					...all ? {} : { when: worst.when }
				};
				report(acknowledged.has(pair) ? {
					...finding,
					severity: "info",
					message: `${finding.message} (acknowledged)`
				} : finding);
			}
		}
	},
	aliasDepth,
	allowedSources
];
const RANK$1 = {
	error: 3,
	warning: 2,
	info: 1
};
/** Rule defaults → presets from `extends` (in order) → `rules` from the config. */
function resolveSettings(config, rules = RULES) {
	const settings = /* @__PURE__ */ new Map();
	for (const r of rules) settings.set(r.id, {
		severity: r.defaultSeverity,
		options: {}
	});
	const apply = (entries) => {
		for (const [id, value] of Object.entries(entries)) {
			const prev = settings.get(id) ?? {
				severity: "warning",
				options: {}
			};
			if (Array.isArray(value)) settings.set(id, {
				severity: value[0],
				options: {
					...prev.options,
					...value[1]
				}
			});
			else settings.set(id, {
				...prev,
				severity: value
			});
		}
	};
	for (const name of config.extends ?? ["recommended"]) {
		const preset = PRESETS[name];
		if (!preset) throw new Error(`Unknown preset "${name}". Available: ${Object.keys(PRESETS).join(", ")}`);
		apply(preset);
	}
	apply(config.rules ?? {});
	return settings;
}
/**
* Runs the rules over a graph. Parse diagnostics of the snapshot are reported as findings too;
* their severity can be overridden (or turned off) by code in `rules`.
*/
async function check(graph, config = {}, extraRules = []) {
	const rules = [...RULES, ...extraRules];
	const settings = resolveSettings(config, rules);
	const drafts = [];
	const byOrigin = /* @__PURE__ */ new Map();
	for (const t of graph.tokens()) byOrigin.set(`${t.origin.file}#${t.origin.pointer}`, t.id);
	for (const d of graph.snapshot.diagnostics) {
		const severity = settings.get(d.code)?.severity ?? d.severity;
		if (severity === "off") continue;
		const node = d.loc ? byOrigin.get(`${d.loc.file}#${d.loc.pointer}`) : void 0;
		const f = {
			rule: d.code,
			severity,
			message: d.message,
			nodes: node ? [node] : []
		};
		if (d.loc) f.loc = d.loc;
		drafts.push(f);
	}
	for (const rule of rules) {
		const setting = settings.get(rule.id);
		if (setting.severity === "off") continue;
		const ctx = {
			graph,
			options: setting.options,
			config,
			report(r) {
				const f = {
					rule: rule.id,
					severity: r.severity && RANK$1[r.severity] < RANK$1[setting.severity] ? r.severity : setting.severity,
					message: r.message,
					nodes: r.nodes
				};
				if (r.evidence) f.evidence = r.evidence;
				if (r.when) f.when = r.when;
				if (r.token) f.loc = r.token.origin;
				drafts.push(f);
			}
		};
		rule.run(ctx);
	}
	const findings = [];
	for (const d of drafts) findings.push({
		id: `${d.rule}#${(await sha256Hex(canonicalize({
			n: d.nodes,
			w: d.when,
			m: d.message
		}))).slice(0, 12)}`,
		...d
	});
	return findings.sort((a, b) => RANK$1[b.severity] - RANK$1[a.severity] || a.rule.localeCompare(b.rule) || a.message.localeCompare(b.message));
}
//#endregion
//#region ../../node_modules/picocolors/picocolors.js
var require_picocolors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let p = process || {};
	let argv = p.argv || [];
	let env = p.env || {};
	let isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
	let formatter = (open, close, replace = open) => (input) => {
		let string = "" + input, index = string.indexOf(close, open.length);
		return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
	};
	let replaceClose = (string, close, replace, index) => {
		let result = "", cursor = 0;
		do {
			result += string.substring(cursor, index) + replace;
			cursor = index + close.length;
			index = string.indexOf(close, cursor);
		} while (~index);
		return result + string.substring(cursor);
	};
	let createColors = (enabled = isColorSupported) => {
		let f = enabled ? formatter : () => String;
		return {
			isColorSupported: enabled,
			reset: f("\x1B[0m", "\x1B[0m"),
			bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
			dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
			italic: f("\x1B[3m", "\x1B[23m"),
			underline: f("\x1B[4m", "\x1B[24m"),
			inverse: f("\x1B[7m", "\x1B[27m"),
			hidden: f("\x1B[8m", "\x1B[28m"),
			strikethrough: f("\x1B[9m", "\x1B[29m"),
			black: f("\x1B[30m", "\x1B[39m"),
			red: f("\x1B[31m", "\x1B[39m"),
			green: f("\x1B[32m", "\x1B[39m"),
			yellow: f("\x1B[33m", "\x1B[39m"),
			blue: f("\x1B[34m", "\x1B[39m"),
			magenta: f("\x1B[35m", "\x1B[39m"),
			cyan: f("\x1B[36m", "\x1B[39m"),
			white: f("\x1B[37m", "\x1B[39m"),
			gray: f("\x1B[90m", "\x1B[39m"),
			bgBlack: f("\x1B[40m", "\x1B[49m"),
			bgRed: f("\x1B[41m", "\x1B[49m"),
			bgGreen: f("\x1B[42m", "\x1B[49m"),
			bgYellow: f("\x1B[43m", "\x1B[49m"),
			bgBlue: f("\x1B[44m", "\x1B[49m"),
			bgMagenta: f("\x1B[45m", "\x1B[49m"),
			bgCyan: f("\x1B[46m", "\x1B[49m"),
			bgWhite: f("\x1B[47m", "\x1B[49m"),
			blackBright: f("\x1B[90m", "\x1B[39m"),
			redBright: f("\x1B[91m", "\x1B[39m"),
			greenBright: f("\x1B[92m", "\x1B[39m"),
			yellowBright: f("\x1B[93m", "\x1B[39m"),
			blueBright: f("\x1B[94m", "\x1B[39m"),
			magentaBright: f("\x1B[95m", "\x1B[39m"),
			cyanBright: f("\x1B[96m", "\x1B[39m"),
			whiteBright: f("\x1B[97m", "\x1B[39m"),
			bgBlackBright: f("\x1B[100m", "\x1B[49m"),
			bgRedBright: f("\x1B[101m", "\x1B[49m"),
			bgGreenBright: f("\x1B[102m", "\x1B[49m"),
			bgYellowBright: f("\x1B[103m", "\x1B[49m"),
			bgBlueBright: f("\x1B[104m", "\x1B[49m"),
			bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
			bgCyanBright: f("\x1B[106m", "\x1B[49m"),
			bgWhiteBright: f("\x1B[107m", "\x1B[49m")
		};
	};
	module.exports = createColors();
	module.exports.createColors = createColors;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/tokenize.js
var require_tokenize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SINGLE_QUOTE = "'".charCodeAt(0);
	const DOUBLE_QUOTE = "\"".charCodeAt(0);
	const BACKSLASH = "\\".charCodeAt(0);
	const SLASH = "/".charCodeAt(0);
	const NEWLINE = "\n".charCodeAt(0);
	const SPACE = " ".charCodeAt(0);
	const FEED = "\f".charCodeAt(0);
	const TAB = "	".charCodeAt(0);
	const CR = "\r".charCodeAt(0);
	const OPEN_SQUARE = "[".charCodeAt(0);
	const CLOSE_SQUARE = "]".charCodeAt(0);
	const OPEN_PARENTHESES = "(".charCodeAt(0);
	const CLOSE_PARENTHESES = ")".charCodeAt(0);
	const OPEN_CURLY = "{".charCodeAt(0);
	const CLOSE_CURLY = "}".charCodeAt(0);
	const SEMICOLON = ";".charCodeAt(0);
	const ASTERISK = "*".charCodeAt(0);
	const COLON = ":".charCodeAt(0);
	const AT = "@".charCodeAt(0);
	const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
	const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
	const RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
	const RE_HEX_ESCAPE = /[\da-f]/i;
	module.exports = function tokenizer(input, options = {}) {
		let css = input.css.valueOf();
		let ignore = options.ignoreErrors;
		let code, content, escape, next, quote;
		let currentToken, escaped, escapePos, n, prev;
		let length = css.length;
		let pos = 0;
		let buffer = [];
		let returned = [];
		let lastBadParen = -1;
		function position() {
			return pos;
		}
		function unclosed(what) {
			throw input.error("Unclosed " + what, pos);
		}
		function endOfFile() {
			return returned.length === 0 && pos >= length;
		}
		function nextToken(opts) {
			if (returned.length) return returned.pop();
			if (pos >= length) return;
			let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
			code = css.charCodeAt(pos);
			switch (code) {
				case NEWLINE:
				case SPACE:
				case TAB:
				case CR:
				case FEED:
					next = pos;
					do {
						next += 1;
						code = css.charCodeAt(next);
					} while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
					currentToken = ["space", css.slice(pos, next)];
					pos = next - 1;
					break;
				case OPEN_SQUARE:
				case CLOSE_SQUARE:
				case OPEN_CURLY:
				case CLOSE_CURLY:
				case COLON:
				case SEMICOLON:
				case CLOSE_PARENTHESES: {
					let controlChar = String.fromCharCode(code);
					currentToken = [
						controlChar,
						controlChar,
						pos
					];
					break;
				}
				case OPEN_PARENTHESES:
					prev = buffer.length ? buffer.pop()[1] : "";
					n = css.charCodeAt(pos + 1);
					if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
						next = pos;
						do {
							escaped = false;
							next = css.indexOf(")", next + 1);
							if (next === -1) {
								if (ignore || ignoreUnclosed) {
									next = pos;
									break;
								} else unclosed("bracket");
							}
							escapePos = next;
							while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
								escapePos -= 1;
								escaped = !escaped;
							}
						} while (escaped);
						currentToken = [
							"brackets",
							css.slice(pos, next + 1),
							pos,
							next
						];
						pos = next;
					} else if (pos <= lastBadParen) currentToken = [
						"(",
						"(",
						pos
					];
					else {
						next = css.indexOf(")", pos + 1);
						content = css.slice(pos, next + 1);
						if (next === -1 || RE_BAD_BRACKET.test(content)) {
							lastBadParen = next === -1 ? length : next;
							currentToken = [
								"(",
								"(",
								pos
							];
						} else {
							currentToken = [
								"brackets",
								content,
								pos,
								next
							];
							pos = next;
						}
					}
					break;
				case SINGLE_QUOTE:
				case DOUBLE_QUOTE:
					quote = code === SINGLE_QUOTE ? "'" : "\"";
					next = pos;
					do {
						escaped = false;
						next = css.indexOf(quote, next + 1);
						if (next === -1) {
							if (ignore || ignoreUnclosed) {
								next = pos + 1;
								break;
							} else unclosed("string");
						}
						escapePos = next;
						while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
							escapePos -= 1;
							escaped = !escaped;
						}
					} while (escaped);
					currentToken = [
						"string",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				case AT:
					RE_AT_END.lastIndex = pos + 1;
					RE_AT_END.test(css);
					if (RE_AT_END.lastIndex === 0) next = css.length - 1;
					else next = RE_AT_END.lastIndex - 2;
					currentToken = [
						"at-word",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				case BACKSLASH:
					next = pos;
					escape = true;
					while (css.charCodeAt(next + 1) === BACKSLASH) {
						next += 1;
						escape = !escape;
					}
					code = css.charCodeAt(next + 1);
					if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
						next += 1;
						if (RE_HEX_ESCAPE.test(css.charAt(next))) {
							while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) next += 1;
							if (css.charCodeAt(next + 1) === SPACE) next += 1;
						}
					}
					currentToken = [
						"word",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				default: if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
					next = css.indexOf("*/", pos + 2) + 1;
					if (next === 0) {
						if (ignore || ignoreUnclosed) next = css.length;
						else unclosed("comment");
					}
					currentToken = [
						"comment",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
				} else {
					RE_WORD_END.lastIndex = pos + 1;
					RE_WORD_END.test(css);
					if (RE_WORD_END.lastIndex === 0) next = css.length - 1;
					else next = RE_WORD_END.lastIndex - 2;
					currentToken = [
						"word",
						css.slice(pos, next + 1),
						pos,
						next
					];
					buffer.push(currentToken);
					pos = next;
				}
			}
			pos++;
			return currentToken;
		}
		function back(token) {
			returned.push(token);
		}
		return {
			back,
			endOfFile,
			nextToken,
			position
		};
	};
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/terminal-highlight.js
var require_terminal_highlight = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let pico = require_picocolors();
	let tokenizer = require_tokenize();
	let Input;
	function registerInput(dependant) {
		Input = dependant;
	}
	const HIGHLIGHT_THEME = {
		";": pico.yellow,
		":": pico.yellow,
		"(": pico.cyan,
		")": pico.cyan,
		"[": pico.yellow,
		"]": pico.yellow,
		"{": pico.yellow,
		"}": pico.yellow,
		"at-word": pico.cyan,
		"brackets": pico.cyan,
		"call": pico.cyan,
		"class": pico.yellow,
		"comment": pico.gray,
		"hash": pico.magenta,
		"string": pico.green
	};
	function getTokenType([type, value], processor) {
		if (type === "word") {
			if (value[0] === ".") return "class";
			if (value[0] === "#") return "hash";
		}
		if (!processor.endOfFile()) {
			let next = processor.nextToken();
			processor.back(next);
			if (next[0] === "brackets" || next[0] === "(") return "call";
		}
		return type;
	}
	function terminalHighlight(css) {
		let processor = tokenizer(new Input(css), { ignoreErrors: true });
		let result = "";
		while (!processor.endOfFile()) {
			let token = processor.nextToken();
			let color = HIGHLIGHT_THEME[getTokenType(token, processor)];
			if (color) result += token[1].split(/\r?\n/).map((i) => color(i)).join("\n");
			else result += token[1];
		}
		return result;
	}
	terminalHighlight.registerInput = registerInput;
	module.exports = terminalHighlight;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/css-syntax-error.js
var require_css_syntax_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let pico = require_picocolors();
	let terminalHighlight = require_terminal_highlight();
	var CssSyntaxError = class CssSyntaxError extends Error {
		constructor(message, line, column, source, file, plugin) {
			super(message);
			this.name = "CssSyntaxError";
			this.reason = message;
			if (file) this.file = file;
			if (source) this.source = source;
			if (plugin) this.plugin = plugin;
			if (typeof line !== "undefined" && typeof column !== "undefined") {
				if (typeof line === "number") {
					this.line = line;
					this.column = column;
				} else {
					this.line = line.line;
					this.column = line.column;
					this.endLine = column.line;
					this.endColumn = column.column;
				}
			}
			this.setMessage();
			if (Error.captureStackTrace) Error.captureStackTrace(this, CssSyntaxError);
		}
		setMessage() {
			this.message = this.plugin ? this.plugin + ": " : "";
			this.message += this.file ? this.file : "<css input>";
			if (typeof this.line !== "undefined") this.message += ":" + this.line + ":" + this.column;
			this.message += ": " + this.reason;
		}
		showSourceCode(color) {
			if (!this.source) return "";
			let css = this.source;
			if (color == null) color = pico.isColorSupported;
			let aside = (text) => text;
			let mark = (text) => text;
			let highlight = (text) => text;
			if (color) {
				let { bold, gray, red } = pico.createColors(true);
				mark = (text) => bold(red(text));
				aside = (text) => gray(text);
				if (terminalHighlight) highlight = (text) => terminalHighlight(text);
			}
			let lines = css.split(/\r?\n/);
			let start = Math.max(this.line - 3, 0);
			let end = Math.min(this.line + 2, lines.length);
			let maxWidth = String(end).length;
			return lines.slice(start, end).map((line, index) => {
				let number = start + 1 + index;
				let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
				if (number === this.line) {
					if (line.length > 160) {
						let padding = 20;
						let subLineStart = Math.max(0, this.column - padding);
						let subLineEnd = Math.max(this.column + padding, this.endColumn + padding);
						let subLine = line.slice(subLineStart, subLineEnd);
						let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, Math.min(this.column - 1, 19)).replace(/[^\t]/g, " ");
						return mark(">") + aside(gutter) + highlight(subLine) + "\n " + spacing + mark("^");
					}
					let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
					return mark(">") + aside(gutter) + highlight(line) + "\n " + spacing + mark("^");
				}
				return " " + aside(gutter) + highlight(line);
			}).join("\n");
		}
		toString() {
			let code = this.showSourceCode();
			if (code) code = "\n\n" + code + "\n";
			return this.name + ": " + this.message + code;
		}
	};
	module.exports = CssSyntaxError;
	CssSyntaxError.default = CssSyntaxError;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/stringifier.js
var require_stringifier = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const STYLE_TAG = /(<)(\/?style\b)/gi;
	const COMMENT_OPEN = /(<)(!--)/g;
	const AT_NAME_END = /[\t\n\f\r "#'()/;[\\\]{}]/;
	function escapeHTMLInCSS(str) {
		if (typeof str !== "string") return str;
		if (!str.includes("<")) return str;
		return str.replace(STYLE_TAG, "\\3c $2").replace(COMMENT_OPEN, "\\3c $2");
	}
	const DEFAULT_RAW = {
		after: "\n",
		beforeClose: "\n",
		beforeComment: "\n",
		beforeDecl: "\n",
		beforeOpen: " ",
		beforeRule: "\n",
		colon: ": ",
		commentLeft: " ",
		commentRight: " ",
		emptyBody: "",
		indent: "    ",
		semicolon: false
	};
	function capitalize(str) {
		return str[0].toUpperCase() + str.slice(1);
	}
	function atruleStart(str, node) {
		let name = "@" + node.name;
		let params = node.params ? str.rawValue(node, "params") : "";
		let afterName = node.raws.afterName;
		if (typeof afterName === "undefined") afterName = params ? " " : "";
		else if (afterName === "" && params && !AT_NAME_END.test(params[0])) afterName = " ";
		return name + afterName + params;
	}
	function isCustomProperty(node) {
		if (!node.prop.startsWith("--")) return false;
		let before = node.raws.before;
		return typeof before === "undefined" || !/\S$/.test(before);
	}
	function pushBody(str, stack, node) {
		let nodes = node.nodes;
		let last = nodes.length - 1;
		while (last > 0) {
			if (nodes[last].type !== "comment") break;
			last -= 1;
		}
		let semicolon = str.raw(node, "semicolon");
		let isDocument = node.type === "document";
		for (let i = nodes.length - 1; i >= 0; i--) {
			let child = nodes[i];
			let childSemicolon = last !== i || semicolon;
			if (!childSemicolon && i < nodes.length - 1 && (child.type === "atrule" && !child.nodes || child.type === "decl" && isCustomProperty(child))) childSemicolon = true;
			stack.push({
				document: isDocument,
				node: child,
				semicolon: childSemicolon
			});
		}
	}
	function pushBlock(str, stack, node, start) {
		let between = str.raw(node, "between", "beforeOpen");
		str.builder(escapeHTMLInCSS(start + between) + "{", node, "start");
		let hasNodes = node.nodes && node.nodes.length;
		let close = () => {
			let after = hasNodes ? str.raw(node, "after") : str.raw(node, "after", "emptyBody");
			if (after) str.builder(escapeHTMLInCSS(after));
			str.builder("}", node, "end");
			if (node.type === "rule" && node.raws.ownSemicolon) str.builder(escapeHTMLInCSS(node.raws.ownSemicolon), node, "end");
		};
		if (hasNodes) {
			stack.push(close);
			pushBody(str, stack, node);
		} else close();
	}
	var Stringifier = class Stringifier {
		constructor(builder) {
			this.builder = builder;
		}
		atrule(node, semicolon) {
			let start = atruleStart(this, node);
			if (node.nodes) this.block(node, start);
			else {
				let end = (node.raws.between || "") + (semicolon ? ";" : "");
				this.builder(escapeHTMLInCSS(start + end), node);
			}
		}
		beforeAfter(node, detect) {
			let value;
			if (node.type === "decl") value = this.raw(node, null, "beforeDecl");
			else if (node.type === "comment") value = this.raw(node, null, "beforeComment");
			else if (detect === "before") value = this.raw(node, null, "beforeRule");
			else value = this.raw(node, null, "beforeClose");
			let buf = node.parent;
			let depth = 0;
			while (buf && buf.type !== "root") {
				depth += 1;
				buf = buf.parent;
			}
			if (value.includes("\n")) {
				let indent = this.raw(node, null, "indent");
				if (indent.length) for (let step = 0; step < depth; step++) value += indent;
			}
			return value;
		}
		block(node, start) {
			let between = this.raw(node, "between", "beforeOpen");
			this.builder(escapeHTMLInCSS(start + between) + "{", node, "start");
			let after;
			if (node.nodes && node.nodes.length) {
				this.body(node);
				after = this.raw(node, "after");
			} else after = this.raw(node, "after", "emptyBody");
			if (after) this.builder(escapeHTMLInCSS(after));
			this.builder("}", node, "end");
		}
		body(node) {
			let proto = Stringifier.prototype;
			let expandable = [
				"atrule",
				"block",
				"body",
				"rule",
				"stringify"
			].every((method) => this[method] === proto[method]);
			let stack = [];
			pushBody(this, stack, node);
			while (stack.length > 0) {
				let entry = stack.pop();
				if (typeof entry === "function") {
					entry();
					continue;
				}
				let child = entry.node;
				let before = this.raw(child, "before");
				if (before) this.builder(entry.document ? before : escapeHTMLInCSS(before));
				if (expandable && child.type === "rule") pushBlock(this, stack, child, this.rawValue(child, "selector"));
				else if (expandable && child.type === "atrule" && child.nodes) pushBlock(this, stack, child, atruleStart(this, child));
				else this.stringify(child, entry.semicolon);
			}
		}
		comment(node) {
			let left = this.raw(node, "left", "commentLeft");
			let right = this.raw(node, "right", "commentRight");
			this.builder(escapeHTMLInCSS("/*" + left + node.text + right + "*/"), node);
		}
		decl(node, semicolon) {
			let raws = node.raws;
			let between = this.raw(node, "between", "colon");
			let string = node.prop + between + this.rawValue(node, "value");
			if (node.important) string += raws.important || " !important";
			if (semicolon) string += ";";
			this.builder(escapeHTMLInCSS(string), node);
		}
		document(node) {
			this.body(node);
		}
		raw(node, own, detect) {
			let value;
			if (!detect) detect = own;
			if (own) {
				value = node.raws[own];
				if (typeof value !== "undefined") return value;
			}
			let parent = node.parent;
			if (detect === "before") {
				if (!parent || parent.type === "root" && parent.first === node) return "";
				if (parent && parent.type === "document") return "";
			}
			if (!parent) return DEFAULT_RAW[detect];
			let root = node.root();
			let cache = root.rawCache || (root.rawCache = {});
			if (typeof cache[detect] !== "undefined") return cache[detect];
			if (detect === "before" || detect === "after") return this.beforeAfter(node, detect);
			else {
				let method = "raw" + capitalize(detect);
				if (this[method]) value = this[method](root, node);
				else root.walk((i) => {
					value = i.raws[own];
					if (typeof value !== "undefined") return false;
				});
			}
			if (typeof value === "undefined") value = DEFAULT_RAW[detect];
			cache[detect] = value;
			return value;
		}
		rawBeforeClose(root) {
			let value;
			root.walk((i) => {
				if (i.nodes && i.nodes.length > 0) {
					if (typeof i.raws.after !== "undefined") {
						value = i.raws.after;
						if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
						return false;
					}
				}
			});
			if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeComment(root, node) {
			let value;
			root.walkComments((i) => {
				if (typeof i.raws.before !== "undefined") {
					value = i.raws.before;
					if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
					return false;
				}
			});
			if (typeof value === "undefined") value = this.raw(node, null, "beforeDecl");
			else if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeDecl(root, node) {
			let value;
			root.walkDecls((i) => {
				if (typeof i.raws.before !== "undefined") {
					value = i.raws.before;
					if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
					return false;
				}
			});
			if (typeof value === "undefined") value = this.raw(node, null, "beforeRule");
			else if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeOpen(root) {
			let value;
			root.walk((i) => {
				if (i.type !== "decl") {
					value = i.raws.between;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawBeforeRule(root) {
			let value;
			root.walk((i) => {
				if (i.nodes && (i.parent !== root || root.first !== i)) {
					if (typeof i.raws.before !== "undefined") {
						value = i.raws.before;
						if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
						return false;
					}
				}
			});
			if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawColon(root) {
			let value;
			root.walkDecls((i) => {
				if (typeof i.raws.between !== "undefined") {
					value = i.raws.between.replace(/[^\s:]/g, "");
					return false;
				}
			});
			return value;
		}
		rawEmptyBody(root) {
			let value;
			root.walk((i) => {
				if (i.nodes && i.nodes.length === 0) {
					value = i.raws.after;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawIndent(root) {
			if (root.raws.indent) return root.raws.indent;
			let value;
			root.walk((i) => {
				let p = i.parent;
				if (p && p !== root && p.parent && p.parent === root) {
					if (typeof i.raws.before !== "undefined") {
						let parts = i.raws.before.split("\n");
						value = parts[parts.length - 1];
						value = value.replace(/\S/g, "");
						return false;
					}
				}
			});
			return value;
		}
		rawSemicolon(root) {
			let value;
			root.walk((i) => {
				if (i.nodes && i.nodes.length && i.last.type === "decl") {
					value = i.raws.semicolon;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawValue(node, prop) {
			let value = node[prop];
			let raw = node.raws[prop];
			if (raw && raw.value === value) return raw.raw;
			return value;
		}
		root(node) {
			if (node.source && node.source.input.hasBOM) this.builder("﻿", node, "start");
			this.body(node);
			if (node.raws.after) {
				let after = node.raws.after;
				let isDocument = node.parent && node.parent.type === "document";
				this.builder(isDocument ? after : escapeHTMLInCSS(after));
			}
		}
		rule(node) {
			this.block(node, this.rawValue(node, "selector"));
			if (node.raws.ownSemicolon) this.builder(escapeHTMLInCSS(node.raws.ownSemicolon), node, "end");
		}
		stringify(node, semicolon) {
			/* c8 ignore start */
			if (!this[node.type]) throw new Error("Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier.");
			/* c8 ignore stop */
			this[node.type](node, semicolon);
		}
	};
	module.exports = Stringifier;
	Stringifier.default = Stringifier;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Stringifier = require_stringifier();
	function stringify(node, builder) {
		new Stringifier(builder).stringify(node);
	}
	module.exports = stringify;
	stringify.default = stringify;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/symbols.js
var require_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports.isClean = Symbol("isClean");
	module.exports.my = Symbol("my");
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let CssSyntaxError = require_css_syntax_error();
	let Stringifier = require_stringifier();
	let stringify = require_stringify();
	let { isClean, my } = require_symbols();
	function cloneNode(obj, parent) {
		let cloned = new obj.constructor();
		let stack = [[
			obj,
			cloned,
			parent
		]];
		while (stack.length > 0) {
			let [source, target, targetParent] = stack.pop();
			for (let i in source) {
				if (!Object.prototype.hasOwnProperty.call(source, i))
 /* c8 ignore next 2 */
				continue;
				if (i === "proxyCache") continue;
				let value = source[i];
				let type = typeof value;
				if (i === "parent" && type === "object") {
					if (targetParent) target[i] = targetParent;
				} else if (i === "source") target[i] = value;
				else if (Array.isArray(value)) {
					let children = [];
					target[i] = children;
					for (let j of value) {
						let childClone = new j.constructor();
						children.push(childClone);
						stack.push([
							j,
							childClone,
							target
						]);
					}
				} else {
					if (type === "object" && value !== null) {
						let valueClone = new value.constructor();
						stack.push([
							value,
							valueClone,
							void 0
						]);
						value = valueClone;
					}
					target[i] = value;
				}
			}
		}
		return cloned;
	}
	function sourceOffset(inputCSS, position) {
		if (position && typeof position.offset !== "undefined") return position.offset;
		let column = 1;
		let line = 1;
		let offset = 0;
		for (let i = 0; i < inputCSS.length; i++) {
			if (line === position.line && column === position.column) {
				offset = i;
				break;
			}
			if (inputCSS[i] === "\n") {
				column = 1;
				line += 1;
			} else column += 1;
		}
		return offset;
	}
	var Node = class Node {
		get proxyOf() {
			return this;
		}
		constructor(defaults = {}) {
			this.raws = {};
			this[isClean] = false;
			this[my] = true;
			for (let name of Object.keys(defaults)) {
				if (name === "__proto__") continue;
				if (name === "nodes") {
					this.nodes = [];
					for (let node of defaults[name]) if (typeof node.clone === "function" && node.parent) this.append(node.clone());
					else this.append(node);
				} else this[name] = defaults[name];
			}
		}
		addToError(error) {
			error.postcssNode = this;
			if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
				let s = this.source;
				error.stack = error.stack.replace(/\n\s{4}at /, `$&${s.input.from}:${s.start.line}:${s.start.column}$&`);
			}
			return error;
		}
		after(add) {
			this.parent.insertAfter(this, add);
			return this;
		}
		assign(overrides = {}) {
			for (let name in overrides) this[name] = overrides[name];
			return this;
		}
		before(add) {
			this.parent.insertBefore(this, add);
			return this;
		}
		cleanRaws(keepBetween) {
			delete this.raws.before;
			delete this.raws.after;
			if (!keepBetween) delete this.raws.between;
		}
		clone(overrides = {}) {
			let cloned = cloneNode(this);
			for (let name in overrides) cloned[name] = overrides[name];
			return cloned;
		}
		cloneAfter(overrides = {}) {
			let cloned = this.clone(overrides);
			this.parent.insertAfter(this, cloned);
			return cloned;
		}
		cloneBefore(overrides = {}) {
			let cloned = this.clone(overrides);
			this.parent.insertBefore(this, cloned);
			return cloned;
		}
		error(message, opts = {}) {
			if (this.source) {
				let { end, start } = this.rangeBy(opts);
				return this.source.input.error(message, {
					column: start.column,
					line: start.line
				}, {
					column: end.column,
					line: end.line
				}, opts);
			}
			return new CssSyntaxError(message);
		}
		getProxyProcessor() {
			return {
				get(node, prop) {
					if (prop === "proxyOf") return node;
					else if (prop === "root") return () => node.root().toProxy();
					else return node[prop];
				},
				set(node, prop, value) {
					if (node[prop] === value) return true;
					node[prop] = value;
					if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || 
					/* c8 ignore next */
					prop === "text") node.markDirty();
					return true;
				}
			};
		}
		/* c8 ignore next 3 */
		markClean() {
			this[isClean] = true;
		}
		markDirty() {
			if (this[isClean]) {
				this[isClean] = false;
				let next = this;
				while (next = next.parent) next[isClean] = false;
			}
		}
		next() {
			if (!this.parent) return void 0;
			let index = this.parent.index(this);
			return this.parent.nodes[index + 1];
		}
		positionBy(opts = {}) {
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let pos = {
				column: this.source.start.column,
				line: this.source.start.line,
				offset: sourceOffset(inputString, this.source.start)
			};
			if (opts.index) pos = this.positionInside(opts.index);
			else if (opts.word) {
				let index = inputString.slice(sourceOffset(inputString, this.source.start), sourceOffset(inputString, this.source.end)).indexOf(opts.word);
				if (index !== -1) pos = this.positionInside(index);
			}
			return pos;
		}
		positionInside(index) {
			let column = this.source.start.column;
			let line = this.source.start.line;
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let offset = sourceOffset(inputString, this.source.start);
			let end = offset + index;
			for (let i = offset; i < end; i++) if (inputString[i] === "\n") {
				column = 1;
				line += 1;
			} else column += 1;
			return {
				column,
				line,
				offset: end
			};
		}
		prev() {
			if (!this.parent) return void 0;
			let index = this.parent.index(this);
			return this.parent.nodes[index - 1];
		}
		rangeBy(opts = {}) {
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let start = {
				column: this.source.start.column,
				line: this.source.start.line,
				offset: sourceOffset(inputString, this.source.start)
			};
			let end = this.source.end ? {
				column: this.source.end.column + 1,
				line: this.source.end.line,
				offset: typeof this.source.end.offset === "number" ? this.source.end.offset : sourceOffset(inputString, this.source.end) + 1
			} : {
				column: start.column + 1,
				line: start.line,
				offset: start.offset + 1
			};
			if (opts.word) {
				let index = inputString.slice(sourceOffset(inputString, this.source.start), sourceOffset(inputString, this.source.end)).indexOf(opts.word);
				if (index !== -1) {
					start = this.positionInside(index);
					end = this.positionInside(index + opts.word.length);
				}
			} else {
				if (opts.start) start = {
					column: opts.start.column,
					line: opts.start.line,
					offset: sourceOffset(inputString, opts.start)
				};
				else if (typeof opts.index === "number") start = this.positionInside(opts.index);
				if (opts.end) end = {
					column: opts.end.column,
					line: opts.end.line,
					offset: sourceOffset(inputString, opts.end)
				};
				else if (typeof opts.endIndex === "number") end = this.positionInside(opts.endIndex);
				else if (typeof opts.index === "number") end = this.positionInside(opts.index + 1);
			}
			if (end.line < start.line || end.line === start.line && end.column <= start.column) end = {
				column: start.column + 1,
				line: start.line,
				offset: start.offset + 1
			};
			return {
				end,
				start
			};
		}
		raw(prop, defaultType) {
			return new Stringifier().raw(this, prop, defaultType);
		}
		remove() {
			if (this.parent) this.parent.removeChild(this);
			this.parent = void 0;
			return this;
		}
		replaceWith(...nodes) {
			if (this.parent) {
				let bookmark = this;
				let foundSelf = false;
				for (let node of nodes) if (node === this) foundSelf = true;
				else if (foundSelf) {
					this.parent.insertAfter(bookmark, node);
					bookmark = node;
				} else this.parent.insertBefore(bookmark, node);
				if (!foundSelf) this.remove();
			}
			return this;
		}
		root() {
			let result = this;
			while (result.parent && result.parent.type !== "document") result = result.parent;
			return result;
		}
		toJSON(_, inputs) {
			let emitInputs = inputs == null;
			inputs = inputs || /* @__PURE__ */ new Map();
			let holderOfRoot = [];
			let queue = [[
				this,
				holderOfRoot,
				0
			]];
			for (let step = 0; step < queue.length; step++) {
				let [node, holder, key] = queue[step];
				let fixed = {};
				holder[key] = fixed;
				for (let name in node) {
					if (!Object.prototype.hasOwnProperty.call(node, name))
 /* c8 ignore next 2 */
					continue;
					if (name === "parent" || name === "proxyCache") continue;
					let value = node[name];
					if (Array.isArray(value)) {
						let fixedArray = [];
						fixed[name] = fixedArray;
						for (let i = 0; i < value.length; i++) {
							let item = value[i];
							if (typeof item === "object" && item.toJSON) {
								if (item.toJSON === Node.prototype.toJSON) queue.push([
									item,
									fixedArray,
									i
								]);
								else fixedArray[i] = item.toJSON(null, inputs);
							} else fixedArray[i] = item;
						}
					} else if (typeof value === "object" && value.toJSON) {
						if (value.toJSON === Node.prototype.toJSON) queue.push([
							value,
							fixed,
							name
						]);
						else fixed[name] = value.toJSON(null, inputs);
					} else if (name === "source") {
						if (value == null) continue;
						let inputId = inputs.get(value.input);
						if (inputId == null) {
							inputId = inputs.size;
							inputs.set(value.input, inputId);
						}
						fixed[name] = {
							end: value.end,
							inputId,
							start: value.start
						};
					} else fixed[name] = value;
				}
			}
			let fixed = holderOfRoot[0];
			if (emitInputs) fixed.inputs = [...inputs.keys()].map((input) => input.toJSON());
			return fixed;
		}
		toProxy() {
			if (!this.proxyCache) this.proxyCache = new Proxy(this, this.getProxyProcessor());
			return this.proxyCache;
		}
		toString(stringifier = stringify) {
			if (stringifier.stringify) stringifier = stringifier.stringify;
			let result = "";
			stringifier(this, (i) => {
				result += i;
			});
			return result;
		}
		warn(result, text, opts = {}) {
			let data = { node: this };
			for (let i in opts) data[i] = opts[i];
			return result.warn(text, data);
		}
	};
	module.exports = Node;
	Node.default = Node;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/comment.js
var require_comment = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Node = require_node();
	var Comment = class extends Node {
		constructor(defaults) {
			super(defaults);
			this.type = "comment";
		}
	};
	module.exports = Comment;
	Comment.default = Comment;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/declaration.js
var require_declaration = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Node = require_node();
	var Declaration = class extends Node {
		get variable() {
			return this.prop.startsWith("--") || this.prop[0] === "$";
		}
		constructor(defaults) {
			if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") defaults = {
				...defaults,
				value: String(defaults.value)
			};
			super(defaults);
			this.type = "decl";
		}
	};
	module.exports = Declaration;
	Declaration.default = Declaration;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/container.js
var require_container = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Comment = require_comment();
	let Declaration = require_declaration();
	let Node = require_node();
	let { isClean, my } = require_symbols();
	let AtRule;
	let parse;
	let Root;
	let Rule;
	function cleanSource(nodes) {
		let stack = nodes.slice();
		while (stack.length > 0) {
			let node = stack.pop();
			delete node.source;
			if (node.nodes) {
				node.nodes = node.nodes.slice();
				for (let i of node.nodes) stack.push(i);
			}
		}
		return nodes.slice();
	}
	function markTreeDirty(node) {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			next[isClean] = false;
			if (next.proxyOf.nodes) for (let i of next.proxyOf.nodes) stack.push(i);
		}
	}
	var Container = class Container extends Node {
		get first() {
			if (!this.proxyOf.nodes) return void 0;
			return this.proxyOf.nodes[0];
		}
		get last() {
			if (!this.proxyOf.nodes) return void 0;
			return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
		}
		append(...children) {
			for (let child of children) {
				let nodes = this.normalize(child, this.last);
				for (let node of nodes) this.proxyOf.nodes.push(node);
			}
			this.markDirty();
			return this;
		}
		cleanRaws(keepBetween) {
			let stack = [this];
			while (stack.length > 0) {
				let node = stack.pop();
				if (node !== this && node.cleanRaws !== Container.prototype.cleanRaws) {
					node.cleanRaws(keepBetween);
					continue;
				}
				Node.prototype.cleanRaws.call(node, keepBetween);
				if (node.nodes) for (let child of node.nodes) stack.push(child);
			}
		}
		each(callback) {
			if (!this.proxyOf.nodes) return void 0;
			let iterator = this.getIterator();
			let index, result;
			while (this.indexes[iterator] < this.proxyOf.nodes.length) {
				index = this.indexes[iterator];
				result = callback(this.proxyOf.nodes[index], index);
				if (result === false) break;
				this.indexes[iterator] += 1;
			}
			delete this.indexes[iterator];
			return result;
		}
		every(condition) {
			return this.nodes.every(condition);
		}
		getIterator() {
			if (!this.lastEach) this.lastEach = 0;
			if (!this.indexes) this.indexes = {};
			this.lastEach += 1;
			let iterator = this.lastEach;
			this.indexes[iterator] = 0;
			return iterator;
		}
		getProxyProcessor() {
			return {
				get(node, prop) {
					if (prop === "proxyOf") return node;
					else if (!node[prop]) return node[prop];
					else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) return (...args) => {
						return node[prop](...args.map((i) => {
							if (typeof i === "function") return (child, index) => i(child.toProxy(), index);
							else return i;
						}));
					};
					else if (prop === "every" || prop === "some") return (cb) => {
						return node[prop]((child, ...other) => cb(child.toProxy(), ...other));
					};
					else if (prop === "root") return () => node.root().toProxy();
					else if (prop === "nodes") return node.nodes.map((i) => i.toProxy());
					else if (prop === "first" || prop === "last") return node[prop].toProxy();
					else return node[prop];
				},
				set(node, prop, value) {
					if (node[prop] === value) return true;
					node[prop] = value;
					if (prop === "name" || prop === "params" || prop === "selector") node.markDirty();
					return true;
				}
			};
		}
		index(child) {
			if (typeof child === "number") return child;
			if (child.proxyOf) child = child.proxyOf;
			return this.proxyOf.nodes.indexOf(child);
		}
		insertAfter(exist, add) {
			let existIndex = this.index(exist);
			let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
			existIndex = this.index(exist);
			for (let node of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (existIndex < index) this.indexes[id] = index + nodes.length;
			}
			this.markDirty();
			return this;
		}
		insertBefore(exist, add) {
			let existIndex = this.index(exist);
			let type = existIndex === 0 ? "prepend" : false;
			let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
			existIndex = this.index(exist);
			for (let node of nodes) this.proxyOf.nodes.splice(existIndex, 0, node);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (existIndex <= index) this.indexes[id] = index + nodes.length;
			}
			this.markDirty();
			return this;
		}
		normalize(nodes, sample) {
			if (typeof nodes === "string") nodes = cleanSource(parse(nodes).nodes);
			else if (typeof nodes === "undefined") nodes = [];
			else if (Array.isArray(nodes)) {
				nodes = nodes.slice(0);
				for (let i of nodes) if (i.parent) i.parent.removeChild(i, "ignore");
			} else if (nodes.type === "root" && this.type !== "document") {
				nodes = nodes.nodes.slice(0);
				for (let i of nodes) if (i.parent) i.parent.removeChild(i, "ignore");
			} else if (nodes.type) nodes = [nodes];
			else if (nodes.prop) {
				if (typeof nodes.value === "undefined") throw new Error("Value field is missed in node creation");
				else if (typeof nodes.value !== "string") nodes.value = String(nodes.value);
				nodes = [new Declaration(nodes)];
			} else if (nodes.selector || nodes.selectors) nodes = [new Rule(nodes)];
			else if (nodes.name) nodes = [new AtRule(nodes)];
			else if (nodes.text) nodes = [new Comment(nodes)];
			else throw new Error("Unknown node type in node creation");
			return nodes.map((i) => {
				/* c8 ignore next */
				if (!i[my]) Container.rebuild(i);
				i = i.proxyOf;
				if (i.parent) i.parent.removeChild(i);
				if (i[isClean]) markTreeDirty(i);
				if (!i.raws) i.raws = {};
				if (typeof i.raws.before === "undefined") {
					if (sample && typeof sample.raws.before !== "undefined") i.raws.before = sample.raws.before.replace(/\S/g, "");
				}
				i.parent = this.proxyOf;
				return i;
			});
		}
		prepend(...children) {
			children = children.reverse();
			for (let child of children) {
				let nodes = this.normalize(child, this.first, "prepend").reverse();
				for (let node of nodes) this.proxyOf.nodes.unshift(node);
				for (let id in this.indexes) this.indexes[id] = this.indexes[id] + nodes.length;
			}
			this.markDirty();
			return this;
		}
		push(child) {
			child.parent = this;
			this.proxyOf.nodes.push(child);
			return this;
		}
		removeAll() {
			for (let node of this.proxyOf.nodes) node.parent = void 0;
			this.proxyOf.nodes = [];
			this.markDirty();
			return this;
		}
		removeChild(child) {
			child = this.index(child);
			this.proxyOf.nodes[child].parent = void 0;
			this.proxyOf.nodes.splice(child, 1);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (index >= child) this.indexes[id] = index - 1;
			}
			this.markDirty();
			return this;
		}
		replaceValues(pattern, opts, callback) {
			if (!callback) {
				callback = opts;
				opts = {};
			}
			this.walkDecls((decl) => {
				if (opts.props && !opts.props.includes(decl.prop)) return;
				if (opts.fast && !decl.value.includes(opts.fast)) return;
				decl.value = decl.value.replace(pattern, callback);
			});
			this.markDirty();
			return this;
		}
		some(condition) {
			return this.nodes.some(condition);
		}
		walk(callback) {
			if (!this.proxyOf.nodes) return void 0;
			let stack = [{
				iterator: this.getIterator(),
				node: this.proxyOf
			}];
			while (stack.length > 0) {
				let { iterator, node } = stack[stack.length - 1];
				let index = node.indexes[iterator];
				if (index >= node.proxyOf.nodes.length) {
					delete node.indexes[iterator];
					stack.pop();
					let parent = stack[stack.length - 1];
					if (parent) parent.node.indexes[parent.iterator] += 1;
					continue;
				}
				let child = node.proxyOf.nodes[index];
				let result;
				try {
					result = callback(child, index);
				} catch (e) {
					throw child.addToError(e);
				}
				if (result === false) {
					for (let opened of stack) delete opened.node.indexes[opened.iterator];
					return false;
				}
				if (child.walk && child.proxyOf.nodes) stack.push({
					iterator: child.getIterator(),
					node: child
				});
				else node.indexes[iterator] += 1;
			}
		}
		walkAtRules(name, callback) {
			if (!callback) {
				callback = name;
				return this.walk((child, i) => {
					if (child.type === "atrule") return callback(child, i);
				});
			}
			if (name instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "atrule" && name.test(child.name)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "atrule" && child.name === name) return callback(child, i);
			});
		}
		walkComments(callback) {
			return this.walk((child, i) => {
				if (child.type === "comment") return callback(child, i);
			});
		}
		walkDecls(prop, callback) {
			if (!callback) {
				callback = prop;
				return this.walk((child, i) => {
					if (child.type === "decl") return callback(child, i);
				});
			}
			if (prop instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "decl" && prop.test(child.prop)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "decl" && child.prop === prop) return callback(child, i);
			});
		}
		walkRules(selector, callback) {
			if (!callback) {
				callback = selector;
				return this.walk((child, i) => {
					if (child.type === "rule") return callback(child, i);
				});
			}
			if (selector instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "rule" && selector.test(child.selector)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "rule" && child.selector === selector) return callback(child, i);
			});
		}
	};
	Container.registerParse = (dependant) => {
		parse = dependant;
	};
	Container.registerRule = (dependant) => {
		Rule = dependant;
	};
	Container.registerAtRule = (dependant) => {
		AtRule = dependant;
	};
	Container.registerRoot = (dependant) => {
		Root = dependant;
	};
	module.exports = Container;
	Container.default = Container;
	/* c8 ignore start */
	Container.rebuild = (node) => {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			if (next.type === "atrule") Object.setPrototypeOf(next, AtRule.prototype);
			else if (next.type === "rule") Object.setPrototypeOf(next, Rule.prototype);
			else if (next.type === "decl") Object.setPrototypeOf(next, Declaration.prototype);
			else if (next.type === "comment") Object.setPrototypeOf(next, Comment.prototype);
			else if (next.type === "root") Object.setPrototypeOf(next, Root.prototype);
			next[my] = true;
			if (next.nodes) for (let child of next.nodes) stack.push(child);
		}
	};
}));
/* c8 ignore stop */
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/at-rule.js
var require_at_rule = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	var AtRule = class extends Container {
		constructor(defaults) {
			super(defaults);
			this.type = "atrule";
		}
		append(...children) {
			if (!this.proxyOf.nodes) this.nodes = [];
			return super.append(...children);
		}
		prepend(...children) {
			if (!this.proxyOf.nodes) this.nodes = [];
			return super.prepend(...children);
		}
	};
	module.exports = AtRule;
	AtRule.default = AtRule;
	Container.registerAtRule(AtRule);
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/document.js
var require_document = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let LazyResult;
	let Processor;
	var Document = class extends Container {
		constructor(defaults) {
			super({
				type: "document",
				...defaults
			});
			if (!this.nodes) this.nodes = [];
		}
		toResult(opts = {}) {
			return new LazyResult(new Processor(), this, opts).stringify();
		}
	};
	Document.registerLazyResult = (dependant) => {
		LazyResult = dependant;
	};
	Document.registerProcessor = (dependant) => {
		Processor = dependant;
	};
	module.exports = Document;
	Document.default = Document;
}));
//#endregion
//#region ../../node_modules/nanoid/non-secure/index.cjs
var require_non_secure = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
	let customAlphabet = (alphabet, defaultSize = 21) => {
		return (size = defaultSize) => {
			let id = "";
			let i = size | 0;
			while (i-- > 0) id += alphabet[Math.random() * alphabet.length | 0];
			return id;
		};
	};
	let nanoid = (size = 21) => {
		let id = "";
		let i = size | 0;
		while (i-- > 0) id += urlAlphabet[Math.random() * 64 | 0];
		return id;
	};
	module.exports = {
		nanoid,
		customAlphabet
	};
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
	/**
	* Encode an integer in the range of 0 to 63 to a single base 64 digit.
	*/
	exports.encode = function(number) {
		if (0 <= number && number < intToCharMap.length) return intToCharMap[number];
		throw new TypeError("Must be between 0 and 63: " + number);
	};
	/**
	* Decode a single base 64 character code digit to an integer. Returns -1 on
	* failure.
	*/
	exports.decode = function(charCode) {
		var bigA = 65;
		var bigZ = 90;
		var littleA = 97;
		var littleZ = 122;
		var zero = 48;
		var nine = 57;
		var plus = 43;
		var slash = 47;
		var littleOffset = 26;
		var numberOffset = 52;
		if (bigA <= charCode && charCode <= bigZ) return charCode - bigA;
		if (littleA <= charCode && charCode <= littleZ) return charCode - littleA + littleOffset;
		if (zero <= charCode && charCode <= nine) return charCode - zero + numberOffset;
		if (charCode == plus) return 62;
		if (charCode == slash) return 63;
		return -1;
	};
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/base64-vlq.js
var require_base64_vlq = /* @__PURE__ */ __commonJSMin(((exports) => {
	var base64 = require_base64();
	var VLQ_BASE_SHIFT = 5;
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
	var VLQ_BASE_MASK = VLQ_BASE - 1;
	var VLQ_CONTINUATION_BIT = VLQ_BASE;
	/**
	* Converts from a two-complement value to a value where the sign bit is
	* placed in the least significant bit.  For example, as decimals:
	*   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	*   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	*/
	function toVLQSigned(aValue) {
		return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
	}
	/**
	* Converts to a two-complement value from a value where the sign bit is
	* placed in the least significant bit.  For example, as decimals:
	*   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	*   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	*/
	function fromVLQSigned(aValue) {
		var isNegative = (aValue & 1) === 1;
		var shifted = aValue >> 1;
		return isNegative ? -shifted : shifted;
	}
	/**
	* Returns the base 64 VLQ encoded value.
	*/
	exports.encode = function base64VLQ_encode(aValue) {
		var encoded = "";
		var digit;
		var vlq = toVLQSigned(aValue);
		do {
			digit = vlq & VLQ_BASE_MASK;
			vlq >>>= VLQ_BASE_SHIFT;
			if (vlq > 0) digit |= VLQ_CONTINUATION_BIT;
			encoded += base64.encode(digit);
		} while (vlq > 0);
		return encoded;
	};
	/**
	* Decodes the next base 64 VLQ value from the given string and returns the
	* value and the rest of the string via the out parameter.
	*/
	exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
		var strLen = aStr.length;
		var result = 0;
		var shift = 0;
		var continuation, digit;
		do {
			if (aIndex >= strLen) throw new Error("Expected more digits in base 64 VLQ value.");
			digit = base64.decode(aStr.charCodeAt(aIndex++));
			if (digit === -1) throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
			continuation = !!(digit & VLQ_CONTINUATION_BIT);
			digit &= VLQ_BASE_MASK;
			result = result + (digit << shift);
			shift += VLQ_BASE_SHIFT;
		} while (continuation);
		aOutParam.value = fromVLQSigned(result);
		aOutParam.rest = aIndex;
	};
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* This is a helper function for getting values from parameter/options
	* objects.
	*
	* @param args The object we are extracting values from
	* @param name The name of the property we are getting.
	* @param defaultValue An optional value to return if the property is missing
	* from the object. If this is not specified and the property is missing, an
	* error will be thrown.
	*/
	function getArg(aArgs, aName, aDefaultValue) {
		if (aName in aArgs) return aArgs[aName];
		else if (arguments.length === 3) return aDefaultValue;
		else throw new Error("\"" + aName + "\" is a required argument.");
	}
	exports.getArg = getArg;
	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;
	function urlParse(aUrl) {
		var match = aUrl.match(urlRegexp);
		if (!match) return null;
		return {
			scheme: match[1],
			auth: match[2],
			host: match[3],
			port: match[4],
			path: match[5]
		};
	}
	exports.urlParse = urlParse;
	function urlGenerate(aParsedUrl) {
		var url = "";
		if (aParsedUrl.scheme) url += aParsedUrl.scheme + ":";
		url += "//";
		if (aParsedUrl.auth) url += aParsedUrl.auth + "@";
		if (aParsedUrl.host) url += aParsedUrl.host;
		if (aParsedUrl.port) url += ":" + aParsedUrl.port;
		if (aParsedUrl.path) url += aParsedUrl.path;
		return url;
	}
	exports.urlGenerate = urlGenerate;
	var MAX_CACHED_INPUTS = 32;
	/**
	* Takes some function `f(input) -> result` and returns a memoized version of
	* `f`.
	*
	* We keep at most `MAX_CACHED_INPUTS` memoized results of `f` alive. The
	* memoization is a dumb-simple, linear least-recently-used cache.
	*/
	function lruMemoize(f) {
		var cache = [];
		return function(input) {
			for (var i = 0; i < cache.length; i++) if (cache[i].input === input) {
				var temp = cache[0];
				cache[0] = cache[i];
				cache[i] = temp;
				return cache[0].result;
			}
			var result = f(input);
			cache.unshift({
				input,
				result
			});
			if (cache.length > MAX_CACHED_INPUTS) cache.pop();
			return result;
		};
	}
	/**
	* Normalizes a path, or the path portion of a URL:
	*
	* - Replaces consecutive slashes with one slash.
	* - Removes unnecessary '.' parts.
	* - Removes unnecessary '<dir>/..' parts.
	*
	* Based on code in the Node.js 'path' core module.
	*
	* @param aPath The path or url to normalize.
	*/
	var normalize = lruMemoize(function normalize(aPath) {
		var path = aPath;
		var url = urlParse(aPath);
		if (url) {
			if (!url.path) return aPath;
			path = url.path;
		}
		var isAbsolute = exports.isAbsolute(path);
		var parts = [];
		var start = 0;
		var i = 0;
		while (true) {
			start = i;
			i = path.indexOf("/", start);
			if (i === -1) {
				parts.push(path.slice(start));
				break;
			} else {
				parts.push(path.slice(start, i));
				while (i < path.length && path[i] === "/") i++;
			}
		}
		for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
			part = parts[i];
			if (part === ".") parts.splice(i, 1);
			else if (part === "..") up++;
			else if (up > 0) {
				if (part === "") {
					parts.splice(i + 1, up);
					up = 0;
				} else {
					parts.splice(i, 2);
					up--;
				}
			}
		}
		path = parts.join("/");
		if (path === "") path = isAbsolute ? "/" : ".";
		if (url) {
			url.path = path;
			return urlGenerate(url);
		}
		return path;
	});
	exports.normalize = normalize;
	/**
	* Joins two paths/URLs.
	*
	* @param aRoot The root path or URL.
	* @param aPath The path or URL to be joined with the root.
	*
	* - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	*   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	*   first.
	* - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	*   is updated with the result and aRoot is returned. Otherwise the result
	*   is returned.
	*   - If aPath is absolute, the result is aPath.
	*   - Otherwise the two paths are joined with a slash.
	* - Joining for example 'http://' and 'www.example.com' is also supported.
	*/
	function join(aRoot, aPath) {
		if (aRoot === "") aRoot = ".";
		if (aPath === "") aPath = ".";
		var aPathUrl = urlParse(aPath);
		var aRootUrl = urlParse(aRoot);
		if (aRootUrl) aRoot = aRootUrl.path || "/";
		if (aPathUrl && !aPathUrl.scheme) {
			if (aRootUrl) aPathUrl.scheme = aRootUrl.scheme;
			return urlGenerate(aPathUrl);
		}
		if (aPathUrl || aPath.match(dataUrlRegexp)) return aPath;
		if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
			aRootUrl.host = aPath;
			return urlGenerate(aRootUrl);
		}
		var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
		if (aRootUrl) {
			aRootUrl.path = joined;
			return urlGenerate(aRootUrl);
		}
		return joined;
	}
	exports.join = join;
	exports.isAbsolute = function(aPath) {
		return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
	};
	/**
	* Make a path relative to a URL or another path.
	*
	* @param aRoot The root path or URL.
	* @param aPath The path or URL to be made relative to aRoot.
	*/
	function relative(aRoot, aPath) {
		if (aRoot === "") aRoot = ".";
		aRoot = aRoot.replace(/\/$/, "");
		var level = 0;
		while (aPath.indexOf(aRoot + "/") !== 0) {
			var index = aRoot.lastIndexOf("/");
			if (index < 0) return aPath;
			aRoot = aRoot.slice(0, index);
			if (aRoot.match(/^([^\/]+:\/)?\/*$/)) return aPath;
			++level;
		}
		return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;
	var supportsNullProto = function() {
		return !("__proto__" in Object.create(null));
	}();
	function identity(s) {
		return s;
	}
	/**
	* Because behavior goes wacky when you set `__proto__` on objects, we
	* have to prefix all the strings in our set with an arbitrary character.
	*
	* See https://github.com/mozilla/source-map/pull/31 and
	* https://github.com/mozilla/source-map/issues/30
	*
	* @param String aStr
	*/
	function toSetString(aStr) {
		if (isProtoString(aStr)) return "$" + aStr;
		return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;
	function fromSetString(aStr) {
		if (isProtoString(aStr)) return aStr.slice(1);
		return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;
	function isProtoString(s) {
		if (!s) return false;
		var length = s.length;
		if (length < 9) return false;
		if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) return false;
		for (var i = length - 10; i >= 0; i--) if (s.charCodeAt(i) !== 36) return false;
		return true;
	}
	/**
	* Comparator between two mappings where the original positions are compared.
	*
	* Optionally pass in `true` as `onlyCompareGenerated` to consider two
	* mappings with the same original source/line/column, but different generated
	* line and column the same. Useful when searching for a mapping with a
	* stubbed out mapping.
	*/
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
		var cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0 || onlyCompareOriginal) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;
	function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
		var cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0 || onlyCompareOriginal) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;
	/**
	* Comparator between two mappings with deflated source and name indices where
	* the generated positions are compared.
	*
	* Optionally pass in `true` as `onlyCompareGenerated` to consider two
	* mappings with the same generated line and column, but different
	* source/name/original line and column the same. Useful when searching for a
	* mapping with a stubbed out mapping.
	*/
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
		var cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0 || onlyCompareGenerated) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
		var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0 || onlyCompareGenerated) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;
	function strcmp(aStr1, aStr2) {
		if (aStr1 === aStr2) return 0;
		if (aStr1 === null) return 1;
		if (aStr2 === null) return -1;
		if (aStr1 > aStr2) return 1;
		return -1;
	}
	/**
	* Comparator between two mappings with inflated source and name strings where
	* the generated positions are compared.
	*/
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
		var cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	/**
	* Strip any JSON XSSI avoidance prefix from the string (as documented
	* in the source maps specification), and then parse the string as
	* JSON.
	*/
	function parseSourceMapInput(str) {
		return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	/**
	* Compute the URL of a source given the the source root, the source's
	* URL, and the source map's URL.
	*/
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
		sourceURL = sourceURL || "";
		if (sourceRoot) {
			if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") sourceRoot += "/";
			sourceURL = sourceRoot + sourceURL;
		}
		if (sourceMapURL) {
			var parsed = urlParse(sourceMapURL);
			if (!parsed) throw new Error("sourceMapURL could not be parsed");
			if (parsed.path) {
				var index = parsed.path.lastIndexOf("/");
				if (index >= 0) parsed.path = parsed.path.substring(0, index + 1);
			}
			sourceURL = join(urlGenerate(parsed), sourceURL);
		}
		return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/array-set.js
var require_array_set = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	/**
	* A data structure which is a combination of an array and a set. Adding a new
	* member is O(1), testing for membership is O(1), and finding the index of an
	* element is O(1). Removing elements from the set is not supported. Only
	* strings are supported for membership.
	*/
	function ArraySet() {
		this._array = [];
		this._set = hasNativeMap ? /* @__PURE__ */ new Map() : Object.create(null);
	}
	/**
	* Static method for creating ArraySet instances from an existing array.
	*/
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
		var set = new ArraySet();
		for (var i = 0, len = aArray.length; i < len; i++) set.add(aArray[i], aAllowDuplicates);
		return set;
	};
	/**
	* Return how many unique items are in this ArraySet. If duplicates have been
	* added, than those do not count towards the size.
	*
	* @returns Number
	*/
	ArraySet.prototype.size = function ArraySet_size() {
		return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	/**
	* Add the given string to this set.
	*
	* @param String aStr
	*/
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
		var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
		var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
		var idx = this._array.length;
		if (!isDuplicate || aAllowDuplicates) this._array.push(aStr);
		if (!isDuplicate) {
			if (hasNativeMap) this._set.set(aStr, idx);
			else this._set[sStr] = idx;
		}
	};
	/**
	* Is the given string a member of this set?
	*
	* @param String aStr
	*/
	ArraySet.prototype.has = function ArraySet_has(aStr) {
		if (hasNativeMap) return this._set.has(aStr);
		else {
			var sStr = util.toSetString(aStr);
			return has.call(this._set, sStr);
		}
	};
	/**
	* What is the index of the given string in the array?
	*
	* @param String aStr
	*/
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
		if (hasNativeMap) {
			var idx = this._set.get(aStr);
			if (idx >= 0) return idx;
		} else {
			var sStr = util.toSetString(aStr);
			if (has.call(this._set, sStr)) return this._set[sStr];
		}
		throw new Error("\"" + aStr + "\" is not in the set.");
	};
	/**
	* What is the element at the given index?
	*
	* @param Number aIdx
	*/
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
		if (aIdx >= 0 && aIdx < this._array.length) return this._array[aIdx];
		throw new Error("No element indexed by " + aIdx);
	};
	/**
	* Returns the array representation of this set (which has the proper indices
	* indicated by indexOf). Note that this is a copy of the internal array used
	* for storing the members so that no one can mess with internal state.
	*/
	ArraySet.prototype.toArray = function ArraySet_toArray() {
		return this._array.slice();
	};
	exports.ArraySet = ArraySet;
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/mapping-list.js
var require_mapping_list = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	/**
	* Determine whether mappingB is after mappingA with respect to generated
	* position.
	*/
	function generatedPositionAfter(mappingA, mappingB) {
		var lineA = mappingA.generatedLine;
		var lineB = mappingB.generatedLine;
		var columnA = mappingA.generatedColumn;
		var columnB = mappingB.generatedColumn;
		return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	/**
	* A data structure to provide a sorted view of accumulated mappings in a
	* performance conscious manner. It trades a neglibable overhead in general
	* case for a large speedup in case of mappings being added in order.
	*/
	function MappingList() {
		this._array = [];
		this._sorted = true;
		this._last = {
			generatedLine: -1,
			generatedColumn: 0
		};
	}
	/**
	* Iterate through internal items. This method takes the same arguments that
	* `Array.prototype.forEach` takes.
	*
	* NOTE: The order of the mappings is NOT guaranteed.
	*/
	MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
		this._array.forEach(aCallback, aThisArg);
	};
	/**
	* Add the given source mapping.
	*
	* @param Object aMapping
	*/
	MappingList.prototype.add = function MappingList_add(aMapping) {
		if (generatedPositionAfter(this._last, aMapping)) {
			this._last = aMapping;
			this._array.push(aMapping);
		} else {
			this._sorted = false;
			this._array.push(aMapping);
		}
	};
	/**
	* Returns the flat, sorted array of mappings. The mappings are sorted by
	* generated position.
	*
	* WARNING: This method returns internal data without copying, for
	* performance. The return value must NOT be mutated, and should be treated as
	* an immutable borrow. If you want to take ownership, you must make your own
	* copy.
	*/
	MappingList.prototype.toArray = function MappingList_toArray() {
		if (!this._sorted) {
			this._array.sort(util.compareByGeneratedPositionsInflated);
			this._sorted = true;
		}
		return this._array;
	};
	exports.MappingList = MappingList;
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/source-map-generator.js
var require_source_map_generator = /* @__PURE__ */ __commonJSMin(((exports) => {
	var base64VLQ = require_base64_vlq();
	var util = require_util();
	var ArraySet = require_array_set().ArraySet;
	var MappingList = require_mapping_list().MappingList;
	/**
	* An instance of the SourceMapGenerator represents a source map which is
	* being built incrementally. You may pass an object with the following
	* properties:
	*
	*   - file: The filename of the generated source.
	*   - sourceRoot: A root for all relative URLs in this source map.
	*/
	function SourceMapGenerator(aArgs) {
		if (!aArgs) aArgs = {};
		this._file = util.getArg(aArgs, "file", null);
		this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
		this._skipValidation = util.getArg(aArgs, "skipValidation", false);
		this._ignoreInvalidMapping = util.getArg(aArgs, "ignoreInvalidMapping", false);
		this._sources = new ArraySet();
		this._names = new ArraySet();
		this._mappings = new MappingList();
		this._sourcesContents = null;
	}
	SourceMapGenerator.prototype._version = 3;
	/**
	* Creates a new SourceMapGenerator based on a SourceMapConsumer
	*
	* @param aSourceMapConsumer The SourceMap.
	*/
	SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer, generatorOps) {
		var sourceRoot = aSourceMapConsumer.sourceRoot;
		var generator = new SourceMapGenerator(Object.assign(generatorOps || {}, {
			file: aSourceMapConsumer.file,
			sourceRoot
		}));
		aSourceMapConsumer.eachMapping(function(mapping) {
			var newMapping = { generated: {
				line: mapping.generatedLine,
				column: mapping.generatedColumn
			} };
			if (mapping.source != null) {
				newMapping.source = mapping.source;
				if (sourceRoot != null) newMapping.source = util.relative(sourceRoot, newMapping.source);
				newMapping.original = {
					line: mapping.originalLine,
					column: mapping.originalColumn
				};
				if (mapping.name != null) newMapping.name = mapping.name;
			}
			generator.addMapping(newMapping);
		});
		aSourceMapConsumer.sources.forEach(function(sourceFile) {
			var sourceRelative = sourceFile;
			if (sourceRoot !== null) sourceRelative = util.relative(sourceRoot, sourceFile);
			if (!generator._sources.has(sourceRelative)) generator._sources.add(sourceRelative);
			var content = aSourceMapConsumer.sourceContentFor(sourceFile);
			if (content != null) generator.setSourceContent(sourceFile, content);
		});
		return generator;
	};
	/**
	* Add a single mapping from original source line and column to the generated
	* source's line and column for this source map being created. The mapping
	* object should have the following properties:
	*
	*   - generated: An object with the generated line and column positions.
	*   - original: An object with the original line and column positions.
	*   - source: The original source file (relative to the sourceRoot).
	*   - name: An optional original token name for this mapping.
	*/
	SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
		var generated = util.getArg(aArgs, "generated");
		var original = util.getArg(aArgs, "original", null);
		var source = util.getArg(aArgs, "source", null);
		var name = util.getArg(aArgs, "name", null);
		if (!this._skipValidation) {
			if (this._validateMapping(generated, original, source, name) === false) return;
		}
		if (source != null) {
			source = String(source);
			if (!this._sources.has(source)) this._sources.add(source);
		}
		if (name != null) {
			name = String(name);
			if (!this._names.has(name)) this._names.add(name);
		}
		this._mappings.add({
			generatedLine: generated.line,
			generatedColumn: generated.column,
			originalLine: original != null && original.line,
			originalColumn: original != null && original.column,
			source,
			name
		});
	};
	/**
	* Set the source content for a source file.
	*/
	SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
		var source = aSourceFile;
		if (this._sourceRoot != null) source = util.relative(this._sourceRoot, source);
		if (aSourceContent != null) {
			if (!this._sourcesContents) this._sourcesContents = Object.create(null);
			this._sourcesContents[util.toSetString(source)] = aSourceContent;
		} else if (this._sourcesContents) {
			delete this._sourcesContents[util.toSetString(source)];
			if (Object.keys(this._sourcesContents).length === 0) this._sourcesContents = null;
		}
	};
	/**
	* Applies the mappings of a sub-source-map for a specific source file to the
	* source map being generated. Each mapping to the supplied source file is
	* rewritten using the supplied source map. Note: The resolution for the
	* resulting mappings is the minimium of this map and the supplied map.
	*
	* @param aSourceMapConsumer The source map to be applied.
	* @param aSourceFile Optional. The filename of the source file.
	*        If omitted, SourceMapConsumer's file property will be used.
	* @param aSourceMapPath Optional. The dirname of the path to the source map
	*        to be applied. If relative, it is relative to the SourceMapConsumer.
	*        This parameter is needed when the two source maps aren't in the same
	*        directory, and the source map to be applied contains relative source
	*        paths. If so, those relative source paths need to be rewritten
	*        relative to the SourceMapGenerator.
	*/
	SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
		var sourceFile = aSourceFile;
		if (aSourceFile == null) {
			if (aSourceMapConsumer.file == null) throw new Error("SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's \"file\" property. Both were omitted.");
			sourceFile = aSourceMapConsumer.file;
		}
		var sourceRoot = this._sourceRoot;
		if (sourceRoot != null) sourceFile = util.relative(sourceRoot, sourceFile);
		var newSources = new ArraySet();
		var newNames = new ArraySet();
		this._mappings.unsortedForEach(function(mapping) {
			if (mapping.source === sourceFile && mapping.originalLine != null) {
				var original = aSourceMapConsumer.originalPositionFor({
					line: mapping.originalLine,
					column: mapping.originalColumn
				});
				if (original.source != null) {
					mapping.source = original.source;
					if (aSourceMapPath != null) mapping.source = util.join(aSourceMapPath, mapping.source);
					if (sourceRoot != null) mapping.source = util.relative(sourceRoot, mapping.source);
					mapping.originalLine = original.line;
					mapping.originalColumn = original.column;
					if (original.name != null) mapping.name = original.name;
				}
			}
			var source = mapping.source;
			if (source != null && !newSources.has(source)) newSources.add(source);
			var name = mapping.name;
			if (name != null && !newNames.has(name)) newNames.add(name);
		}, this);
		this._sources = newSources;
		this._names = newNames;
		aSourceMapConsumer.sources.forEach(function(sourceFile) {
			var content = aSourceMapConsumer.sourceContentFor(sourceFile);
			if (content != null) {
				if (aSourceMapPath != null) sourceFile = util.join(aSourceMapPath, sourceFile);
				if (sourceRoot != null) sourceFile = util.relative(sourceRoot, sourceFile);
				this.setSourceContent(sourceFile, content);
			}
		}, this);
	};
	/**
	* A mapping can have one of the three levels of data:
	*
	*   1. Just the generated position.
	*   2. The Generated position, original position, and original source.
	*   3. Generated and original position, original source, as well as a name
	*      token.
	*
	* To maintain consistency, we validate that any new mapping being added falls
	* in to one of these categories.
	*/
	SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
		if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
			var message = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
			if (this._ignoreInvalidMapping) {
				if (typeof console !== "undefined" && console.warn) console.warn(message);
				return false;
			} else throw new Error(message);
		}
		if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) return;
		else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) return;
		else {
			var message = "Invalid mapping: " + JSON.stringify({
				generated: aGenerated,
				source: aSource,
				original: aOriginal,
				name: aName
			});
			if (this._ignoreInvalidMapping) {
				if (typeof console !== "undefined" && console.warn) console.warn(message);
				return false;
			} else throw new Error(message);
		}
	};
	/**
	* Serialize the accumulated mappings in to the stream of base 64 VLQs
	* specified by the source map format.
	*/
	SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
		var previousGeneratedColumn = 0;
		var previousGeneratedLine = 1;
		var previousOriginalColumn = 0;
		var previousOriginalLine = 0;
		var previousName = 0;
		var previousSource = 0;
		var result = "";
		var next;
		var mapping;
		var nameIdx;
		var sourceIdx;
		var mappings = this._mappings.toArray();
		for (var i = 0, len = mappings.length; i < len; i++) {
			mapping = mappings[i];
			next = "";
			if (mapping.generatedLine !== previousGeneratedLine) {
				previousGeneratedColumn = 0;
				var lineDelta = mapping.generatedLine - previousGeneratedLine;
				next += lineDelta === 1 ? ";" : ";".repeat(lineDelta);
				previousGeneratedLine = mapping.generatedLine;
			} else if (i > 0) {
				if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) continue;
				next += ",";
			}
			next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
			previousGeneratedColumn = mapping.generatedColumn;
			if (mapping.source != null) {
				sourceIdx = this._sources.indexOf(mapping.source);
				next += base64VLQ.encode(sourceIdx - previousSource);
				previousSource = sourceIdx;
				next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
				previousOriginalLine = mapping.originalLine - 1;
				next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
				previousOriginalColumn = mapping.originalColumn;
				if (mapping.name != null) {
					nameIdx = this._names.indexOf(mapping.name);
					next += base64VLQ.encode(nameIdx - previousName);
					previousName = nameIdx;
				}
			}
			result += next;
		}
		return result;
	};
	SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
		return aSources.map(function(source) {
			if (!this._sourcesContents) return null;
			if (aSourceRoot != null) source = util.relative(aSourceRoot, source);
			var key = util.toSetString(source);
			return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
		}, this);
	};
	/**
	* Externalize the source map.
	*/
	SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
		var map = {
			version: this._version,
			sources: this._sources.toArray(),
			names: this._names.toArray(),
			mappings: this._serializeMappings()
		};
		if (this._file != null) map.file = this._file;
		if (this._sourceRoot != null) map.sourceRoot = this._sourceRoot;
		if (this._sourcesContents) map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
		return map;
	};
	/**
	* Render the source map being generated to a string.
	*/
	SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
		return JSON.stringify(this.toJSON());
	};
	exports.SourceMapGenerator = SourceMapGenerator;
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/binary-search.js
var require_binary_search = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	/**
	* Recursive implementation of binary search.
	*
	* @param aLow Indices here and lower do not contain the needle.
	* @param aHigh Indices here and higher do not contain the needle.
	* @param aNeedle The element being searched for.
	* @param aHaystack The non-empty array being searched.
	* @param aCompare Function which takes two elements and returns -1, 0, or 1.
	* @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	*     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*/
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
		var mid = Math.floor((aHigh - aLow) / 2) + aLow;
		var cmp = aCompare(aNeedle, aHaystack[mid], true);
		if (cmp === 0) return mid;
		else if (cmp > 0) {
			if (aHigh - mid > 1) return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
			if (aBias == exports.LEAST_UPPER_BOUND) return aHigh < aHaystack.length ? aHigh : -1;
			else return mid;
		} else {
			if (mid - aLow > 1) return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
			if (aBias == exports.LEAST_UPPER_BOUND) return mid;
			else return aLow < 0 ? -1 : aLow;
		}
	}
	/**
	* This is an implementation of binary search which will always try and return
	* the index of the closest element if there is no exact hit. This is because
	* mappings between original and generated line/col pairs are single points,
	* and there is an implicit region between each of them, so a miss just means
	* that you aren't on the very start of a region.
	*
	* @param aNeedle The element you are looking for.
	* @param aHaystack The array that is being searched.
	* @param aCompare A function which takes the needle and an element in the
	*     array and returns -1, 0, or 1 depending on whether the needle is less
	*     than, equal to, or greater than the element, respectively.
	* @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	*     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	*/
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
		if (aHaystack.length === 0) return -1;
		var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
		if (index < 0) return -1;
		while (index - 1 >= 0) {
			if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) break;
			--index;
		}
		return index;
	};
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/quick-sort.js
var require_quick_sort = /* @__PURE__ */ __commonJSMin(((exports) => {
	function SortTemplate(comparator) {
		/**
		* Swap the elements indexed by `x` and `y` in the array `ary`.
		*
		* @param {Array} ary
		*        The array.
		* @param {Number} x
		*        The index of the first item.
		* @param {Number} y
		*        The index of the second item.
		*/
		function swap(ary, x, y) {
			var temp = ary[x];
			ary[x] = ary[y];
			ary[y] = temp;
		}
		/**
		* Returns a random integer within the range `low .. high` inclusive.
		*
		* @param {Number} low
		*        The lower bound on the range.
		* @param {Number} high
		*        The upper bound on the range.
		*/
		function randomIntInRange(low, high) {
			return Math.round(low + Math.random() * (high - low));
		}
		/**
		* The Quick Sort algorithm.
		*
		* @param {Array} ary
		*        An array to sort.
		* @param {function} comparator
		*        Function to use to compare two items.
		* @param {Number} p
		*        Start index of the array
		* @param {Number} r
		*        End index of the array
		*/
		function doQuickSort(ary, comparator, p, r) {
			if (p < r) {
				var pivotIndex = randomIntInRange(p, r);
				var i = p - 1;
				swap(ary, pivotIndex, r);
				var pivot = ary[r];
				for (var j = p; j < r; j++) if (comparator(ary[j], pivot, false) <= 0) {
					i += 1;
					swap(ary, i, j);
				}
				swap(ary, i + 1, j);
				var q = i + 1;
				doQuickSort(ary, comparator, p, q - 1);
				doQuickSort(ary, comparator, q + 1, r);
			}
		}
		return doQuickSort;
	}
	function cloneSort(comparator) {
		let template = SortTemplate.toString();
		return new Function(`return ${template}`)()(comparator);
	}
	let isEvalAllowed = (function() {
		try {
			new Function("return 0")();
			return true;
		} catch {
			return false;
		}
	})();
	/**
	* Sort the given array in-place with the given comparator function.
	*
	* @param {Array} ary
	*        An array to sort.
	* @param {function} comparator
	*        Function to use to compare two items.
	*/
	let sortCache = /* @__PURE__ */ new WeakMap();
	exports.quickSort = function(ary, comparator, start = 0) {
		let doQuickSort = isEvalAllowed ? sortCache.get(comparator) : SortTemplate(comparator);
		if (doQuickSort === void 0) {
			doQuickSort = cloneSort(comparator);
			sortCache.set(comparator, doQuickSort);
		}
		doQuickSort(ary, comparator, start, ary.length - 1);
	};
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/source-map-consumer.js
var require_source_map_consumer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	var binarySearch = require_binary_search();
	var ArraySet = require_array_set().ArraySet;
	var base64VLQ = require_base64_vlq();
	var quickSort = require_quick_sort().quickSort;
	var MAX_SECTION_OFFSET_LINE = 1e7;
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
		return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	};
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	SourceMapConsumer.prototype._version = 3;
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
		configurable: true,
		enumerable: true,
		get: function() {
			if (!this.__generatedMappings) this._parseMappings(this._mappings, this.sourceRoot);
			return this.__generatedMappings;
		}
	});
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
		configurable: true,
		enumerable: true,
		get: function() {
			if (!this.__originalMappings) this._parseMappings(this._mappings, this.sourceRoot);
			return this.__originalMappings;
		}
	});
	SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
		var c = aStr.charAt(index);
		return c === ";" || c === ",";
	};
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		throw new Error("Subclasses must implement _parseMappings");
	};
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	/**
	* Iterate over each mapping between an original source/line/column and a
	* generated line/column in this source map.
	*
	* @param Function aCallback
	*        The function that is called with each mapping.
	* @param Object aContext
	*        Optional. If specified, this object will be the value of `this` every
	*        time that `aCallback` is called.
	* @param aOrder
	*        Either `SourceMapConsumer.GENERATED_ORDER` or
	*        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	*        iterate over the mappings sorted by the generated file's line/column
	*        order or the original's source/line/column order, respectively. Defaults to
	*        `SourceMapConsumer.GENERATED_ORDER`.
	*/
	SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
		var context = aContext || null;
		var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
		var mappings;
		switch (order) {
			case SourceMapConsumer.GENERATED_ORDER:
				mappings = this._generatedMappings;
				break;
			case SourceMapConsumer.ORIGINAL_ORDER:
				mappings = this._originalMappings;
				break;
			default: throw new Error("Unknown order of iteration.");
		}
		var sourceRoot = this.sourceRoot;
		var boundCallback = aCallback.bind(context);
		var names = this._names;
		var sources = this._sources;
		var sourceMapURL = this._sourceMapURL;
		for (var i = 0, n = mappings.length; i < n; i++) {
			var mapping = mappings[i];
			var source = mapping.source === null ? null : sources.at(mapping.source);
			if (source !== null) source = util.computeSourceURL(sourceRoot, source, sourceMapURL);
			boundCallback({
				source,
				generatedLine: mapping.generatedLine,
				generatedColumn: mapping.generatedColumn,
				originalLine: mapping.originalLine,
				originalColumn: mapping.originalColumn,
				name: mapping.name === null ? null : names.at(mapping.name)
			});
		}
	};
	/**
	* Returns all generated line and column information for the original source,
	* line, and column provided. If no column is provided, returns all mappings
	* corresponding to a either the line we are searching for or the next
	* closest line that has any mappings. Otherwise, returns all mappings
	* corresponding to the given line and either the column we are searching for
	* or the next closest column that has any offsets.
	*
	* The only argument is an object with the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number is 1-based.
	*   - column: Optional. the column number in the original source.
	*    The column number is 0-based.
	*
	* and an array of objects is returned, each with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*    line number is 1-based.
	*   - column: The column number in the generated source, or null.
	*    The column number is 0-based.
	*/
	SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
		var line = util.getArg(aArgs, "line");
		var needle = {
			source: util.getArg(aArgs, "source"),
			originalLine: line,
			originalColumn: util.getArg(aArgs, "column", 0)
		};
		needle.source = this._findSourceIndex(needle.source);
		if (needle.source < 0) return [];
		var mappings = [];
		var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
		if (index >= 0) {
			var mapping = this._originalMappings[index];
			if (aArgs.column === void 0) {
				var originalLine = mapping.originalLine;
				while (mapping && mapping.originalLine === originalLine) {
					mappings.push({
						line: util.getArg(mapping, "generatedLine", null),
						column: util.getArg(mapping, "generatedColumn", null),
						lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
					});
					mapping = this._originalMappings[++index];
				}
			} else {
				var originalColumn = mapping.originalColumn;
				while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
					mappings.push({
						line: util.getArg(mapping, "generatedLine", null),
						column: util.getArg(mapping, "generatedColumn", null),
						lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
					});
					mapping = this._originalMappings[++index];
				}
			}
		}
		return mappings;
	};
	exports.SourceMapConsumer = SourceMapConsumer;
	/**
	* A BasicSourceMapConsumer instance represents a parsed source map which we can
	* query for information about the original file positions by giving it a file
	* position in the generated source.
	*
	* The first parameter is the raw source map (either as a JSON string, or
	* already parsed to an object). According to the spec, source maps have the
	* following attributes:
	*
	*   - version: Which version of the source map spec this map is following.
	*   - sources: An array of URLs to the original source files.
	*   - names: An array of identifiers which can be referrenced by individual mappings.
	*   - sourceRoot: Optional. The URL root from which all sources are relative.
	*   - sourcesContent: Optional. An array of contents of the original source files.
	*   - mappings: A string of base64 VLQs which contain the actual mappings.
	*   - file: Optional. The generated file this source map is associated with.
	*
	* Here is an example source map, taken from the source map spec[0]:
	*
	*     {
	*       version : 3,
	*       file: "out.js",
	*       sourceRoot : "",
	*       sources: ["foo.js", "bar.js"],
	*       names: ["src", "maps", "are", "fun"],
	*       mappings: "AA,AB;;ABCDE;"
	*     }
	*
	* The second parameter, if given, is a string whose value is the URL
	* at which the source map was found.  This URL is used to compute the
	* sources array.
	*
	* [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	*/
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		var version = util.getArg(sourceMap, "version");
		var sources = util.getArg(sourceMap, "sources");
		var names = util.getArg(sourceMap, "names", []);
		var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
		var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
		var mappings = util.getArg(sourceMap, "mappings");
		var file = util.getArg(sourceMap, "file", null);
		if (version != this._version) throw new Error("Unsupported version: " + version);
		if (sourceRoot) sourceRoot = util.normalize(sourceRoot);
		sources = sources.map(String).map(util.normalize).map(function(source) {
			return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
		});
		this._names = ArraySet.fromArray(names.map(String), true);
		this._sources = ArraySet.fromArray(sources, true);
		this._absoluteSources = this._sources.toArray().map(function(s) {
			return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
		});
		this.sourceRoot = sourceRoot;
		this.sourcesContent = sourcesContent;
		this._mappings = mappings;
		this._sourceMapURL = aSourceMapURL;
		this.file = file;
	}
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	/**
	* Utility function to find the index of a source.  Returns -1 if not
	* found.
	*/
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
		var relativeSource = aSource;
		if (this.sourceRoot != null) relativeSource = util.relative(this.sourceRoot, relativeSource);
		if (this._sources.has(relativeSource)) return this._sources.indexOf(relativeSource);
		var i = 0;
		for (; i < this._absoluteSources.length; ++i) if (this._absoluteSources[i] == aSource) return i;
		return -1;
	};
	/**
	* Create a BasicSourceMapConsumer from a SourceMapGenerator.
	*
	* @param SourceMapGenerator aSourceMap
	*        The source map that will be consumed.
	* @param String aSourceMapURL
	*        The URL at which the source map can be found (optional)
	* @returns BasicSourceMapConsumer
	*/
	BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
		var smc = Object.create(BasicSourceMapConsumer.prototype);
		var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
		var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
		smc.sourceRoot = aSourceMap._sourceRoot;
		smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
		smc.file = aSourceMap._file;
		smc._sourceMapURL = aSourceMapURL;
		smc._absoluteSources = smc._sources.toArray().map(function(s) {
			return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
		});
		var generatedMappings = aSourceMap._mappings.toArray().slice();
		var destGeneratedMappings = smc.__generatedMappings = [];
		var destOriginalMappings = smc.__originalMappings = [];
		for (var i = 0, length = generatedMappings.length; i < length; i++) {
			var srcMapping = generatedMappings[i];
			var destMapping = new Mapping();
			destMapping.generatedLine = srcMapping.generatedLine;
			destMapping.generatedColumn = srcMapping.generatedColumn;
			if (srcMapping.source) {
				destMapping.source = sources.indexOf(srcMapping.source);
				destMapping.originalLine = srcMapping.originalLine;
				destMapping.originalColumn = srcMapping.originalColumn;
				if (srcMapping.name) destMapping.name = names.indexOf(srcMapping.name);
				destOriginalMappings.push(destMapping);
			}
			destGeneratedMappings.push(destMapping);
		}
		quickSort(smc.__originalMappings, util.compareByOriginalPositions);
		return smc;
	};
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	BasicSourceMapConsumer.prototype._version = 3;
	/**
	* The list of original sources.
	*/
	Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", { get: function() {
		return this._absoluteSources.slice();
	} });
	/**
	* Provide the JIT with a nice shape / hidden class.
	*/
	function Mapping() {
		this.generatedLine = 0;
		this.generatedColumn = 0;
		this.source = null;
		this.originalLine = null;
		this.originalColumn = null;
		this.name = null;
	}
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	const compareGenerated = util.compareByGeneratedPositionsDeflatedNoLine;
	function sortGenerated(array, start) {
		let l = array.length;
		let n = array.length - start;
		if (n <= 1) return;
		else if (n == 2) {
			let a = array[start];
			let b = array[start + 1];
			if (compareGenerated(a, b) > 0) {
				array[start] = b;
				array[start + 1] = a;
			}
		} else if (n < 20) for (let i = start; i < l; i++) for (let j = i; j > start; j--) {
			let a = array[j - 1];
			let b = array[j];
			if (compareGenerated(a, b) <= 0) break;
			array[j - 1] = b;
			array[j] = a;
		}
		else quickSort(array, compareGenerated, start);
	}
	BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		var generatedLine = 1;
		var previousGeneratedColumn = 0;
		var previousOriginalLine = 0;
		var previousOriginalColumn = 0;
		var previousSource = 0;
		var previousName = 0;
		var length = aStr.length;
		var index = 0;
		var temp = {};
		var originalMappings = [];
		var generatedMappings = [], mapping, segment, end, value;
		let subarrayStart = 0;
		while (index < length) if (aStr.charAt(index) === ";") {
			generatedLine++;
			index++;
			previousGeneratedColumn = 0;
			sortGenerated(generatedMappings, subarrayStart);
			subarrayStart = generatedMappings.length;
		} else if (aStr.charAt(index) === ",") index++;
		else {
			mapping = new Mapping();
			mapping.generatedLine = generatedLine;
			for (end = index; end < length; end++) if (this._charIsMappingSeparator(aStr, end)) break;
			aStr.slice(index, end);
			segment = [];
			while (index < end) {
				base64VLQ.decode(aStr, index, temp);
				value = temp.value;
				index = temp.rest;
				segment.push(value);
			}
			if (segment.length === 2) throw new Error("Found a source, but no line and column");
			if (segment.length === 3) throw new Error("Found a source and line, but no column");
			mapping.generatedColumn = previousGeneratedColumn + segment[0];
			previousGeneratedColumn = mapping.generatedColumn;
			if (segment.length > 1) {
				mapping.source = previousSource + segment[1];
				previousSource += segment[1];
				mapping.originalLine = previousOriginalLine + segment[2];
				previousOriginalLine = mapping.originalLine;
				mapping.originalLine += 1;
				mapping.originalColumn = previousOriginalColumn + segment[3];
				previousOriginalColumn = mapping.originalColumn;
				if (segment.length > 4) {
					mapping.name = previousName + segment[4];
					previousName += segment[4];
				}
			}
			generatedMappings.push(mapping);
			if (typeof mapping.originalLine === "number") {
				let currentSource = mapping.source;
				while (originalMappings.length <= currentSource) originalMappings.push(null);
				if (originalMappings[currentSource] === null) originalMappings[currentSource] = [];
				originalMappings[currentSource].push(mapping);
			}
		}
		sortGenerated(generatedMappings, subarrayStart);
		this.__generatedMappings = generatedMappings;
		for (var i = 0; i < originalMappings.length; i++) if (originalMappings[i] != null) quickSort(originalMappings[i], util.compareByOriginalPositionsNoSource);
		this.__originalMappings = [].concat(...originalMappings);
	};
	/**
	* Find the mapping that best matches the hypothetical "needle" mapping that
	* we are searching for in the given "haystack" of mappings.
	*/
	BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
		if (aNeedle[aLineName] <= 0) throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
		if (aNeedle[aColumnName] < 0) throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
		return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	};
	/**
	* Compute the last column for each generated mapping. The last column is
	* inclusive.
	*/
	BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
		for (var index = 0; index < this._generatedMappings.length; ++index) {
			var mapping = this._generatedMappings[index];
			if (index + 1 < this._generatedMappings.length) {
				var nextMapping = this._generatedMappings[index + 1];
				if (mapping.generatedLine === nextMapping.generatedLine) {
					mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
					continue;
				}
			}
			mapping.lastGeneratedColumn = Infinity;
		}
	};
	/**
	* Returns the original source, line, and column information for the generated
	* source's line and column positions provided. The only argument is an object
	* with the following properties:
	*
	*   - line: The line number in the generated source.  The line number
	*     is 1-based.
	*   - column: The column number in the generated source.  The column
	*     number is 0-based.
	*   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	*     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	*
	* and an object is returned with the following properties:
	*
	*   - source: The original source file, or null.
	*   - line: The line number in the original source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the original source, or null.  The
	*     column number is 0-based.
	*   - name: The original identifier, or null.
	*/
	BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
		var needle = {
			generatedLine: util.getArg(aArgs, "line"),
			generatedColumn: util.getArg(aArgs, "column")
		};
		var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
		if (index >= 0) {
			var mapping = this._generatedMappings[index];
			if (mapping.generatedLine === needle.generatedLine) {
				var source = util.getArg(mapping, "source", null);
				if (source !== null) {
					source = this._sources.at(source);
					source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
				}
				var name = util.getArg(mapping, "name", null);
				if (name !== null) name = this._names.at(name);
				return {
					source,
					line: util.getArg(mapping, "originalLine", null),
					column: util.getArg(mapping, "originalColumn", null),
					name
				};
			}
		}
		return {
			source: null,
			line: null,
			column: null,
			name: null
		};
	};
	/**
	* Return true if we have the source content for every source in the source
	* map, false otherwise.
	*/
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
		if (!this.sourcesContent) return false;
		return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
			return sc == null;
		});
	};
	/**
	* Returns the original source content. The only argument is the url of the
	* original source file. Returns null if no original source content is
	* available.
	*/
	BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
		if (!this.sourcesContent) return null;
		var index = this._findSourceIndex(aSource);
		if (index >= 0) return this.sourcesContent[index];
		var relativeSource = aSource;
		if (this.sourceRoot != null) relativeSource = util.relative(this.sourceRoot, relativeSource);
		var url;
		if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
			var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
			if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
			if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
		}
		if (nullOnMissing) return null;
		else throw new Error("\"" + relativeSource + "\" is not in the SourceMap.");
	};
	/**
	* Returns the generated line and column information for the original source,
	* line, and column positions provided. The only argument is an object with
	* the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number
	*     is 1-based.
	*   - column: The column number in the original source.  The column
	*     number is 0-based.
	*   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	*     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	*
	* and an object is returned with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the generated source, or null.
	*     The column number is 0-based.
	*/
	BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
		var source = util.getArg(aArgs, "source");
		source = this._findSourceIndex(source);
		if (source < 0) return {
			line: null,
			column: null,
			lastColumn: null
		};
		var needle = {
			source,
			originalLine: util.getArg(aArgs, "line"),
			originalColumn: util.getArg(aArgs, "column")
		};
		var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
		if (index >= 0) {
			var mapping = this._originalMappings[index];
			if (mapping.source === needle.source) return {
				line: util.getArg(mapping, "generatedLine", null),
				column: util.getArg(mapping, "generatedColumn", null),
				lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
			};
		}
		return {
			line: null,
			column: null,
			lastColumn: null
		};
	};
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	/**
	* An IndexedSourceMapConsumer instance represents a parsed source map which
	* we can query for information. It differs from BasicSourceMapConsumer in
	* that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	* input.
	*
	* The first parameter is a raw source map (either as a JSON string, or already
	* parsed to an object). According to the spec for indexed source maps, they
	* have the following attributes:
	*
	*   - version: Which version of the source map spec this map is following.
	*   - file: Optional. The generated file this source map is associated with.
	*   - sections: A list of section definitions.
	*
	* Each value under the "sections" field has two fields:
	*   - offset: The offset into the original specified at which this section
	*       begins to apply, defined as an object with a "line" and "column"
	*       field.
	*   - map: A source map definition. This source map could also be indexed,
	*       but doesn't have to be.
	*
	* Instead of the "map" field, it's also possible to have a "url" field
	* specifying a URL to retrieve a source map from, but that's currently
	* unsupported.
	*
	* Here's an example source map, taken from the source map spec[0], but
	* modified to omit a section which uses the "url" field.
	*
	*  {
	*    version : 3,
	*    file: "app.js",
	*    sections: [{
	*      offset: {line:100, column:10},
	*      map: {
	*        version : 3,
	*        file: "section.js",
	*        sources: ["foo.js", "bar.js"],
	*        names: ["src", "maps", "are", "fun"],
	*        mappings: "AAAA,E;;ABCDE;"
	*      }
	*    }],
	*  }
	*
	* The second parameter, if given, is a string whose value is the URL
	* at which the source map was found.  This URL is used to compute the
	* sources array.
	*
	* [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	*/
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		var version = util.getArg(sourceMap, "version");
		var sections = util.getArg(sourceMap, "sections");
		if (version != this._version) throw new Error("Unsupported version: " + version);
		this._sources = new ArraySet();
		this._names = new ArraySet();
		var lastOffset = {
			line: -1,
			column: 0
		};
		var maxOffsetLine = 0;
		this._sections = sections.map(function(s) {
			if (s.url) throw new Error("Support for url field in sections not implemented.");
			var offset = util.getArg(s, "offset");
			var offsetLine = util.getArg(offset, "line");
			var offsetColumn = util.getArg(offset, "column");
			if (!isValidOffset(offsetLine) || !isValidOffset(offsetColumn)) throw new Error("Section offset line and column must be non-negative integers.");
			if (offsetLine > MAX_SECTION_OFFSET_LINE) throw new Error("Section offset line must not exceed " + MAX_SECTION_OFFSET_LINE + ".");
			if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) throw new Error("Section offsets must be ordered and non-overlapping.");
			lastOffset = offset;
			var consumer = new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL);
			var totalOffsetLine = offsetLine + (consumer._maxOffsetLine || 0);
			if (totalOffsetLine > MAX_SECTION_OFFSET_LINE) throw new Error("Section offset line must not exceed " + MAX_SECTION_OFFSET_LINE + ", including offsets of nested sections.");
			if (totalOffsetLine > maxOffsetLine) maxOffsetLine = totalOffsetLine;
			return {
				generatedOffset: {
					generatedLine: offsetLine + 1,
					generatedColumn: offsetColumn + 1
				},
				consumer
			};
		});
		this._maxOffsetLine = maxOffsetLine;
	}
	/**
	* Section offsets come from untrusted input and are used as line/column
	* numbers, so only accept non-negative safe integers (rejects NaN, Infinity,
	* strings, fractions, etc).
	*/
	function isValidOffset(aValue) {
		return typeof aValue === "number" && aValue >= 0 && aValue <= 9007199254740991 && Math.floor(aValue) === aValue;
	}
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	IndexedSourceMapConsumer.prototype._version = 3;
	/**
	* The list of original sources.
	*/
	Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", { get: function() {
		var sources = [];
		for (var i = 0; i < this._sections.length; i++) {
			var sectionSources = this._sections[i].consumer.sources;
			for (var j = 0; j < sectionSources.length; j++) sources.push(sectionSources[j]);
		}
		return sources;
	} });
	/**
	* Returns the original source, line, and column information for the generated
	* source's line and column positions provided. The only argument is an object
	* with the following properties:
	*
	*   - line: The line number in the generated source.  The line number
	*     is 1-based.
	*   - column: The column number in the generated source.  The column
	*     number is 0-based.
	*
	* and an object is returned with the following properties:
	*
	*   - source: The original source file, or null.
	*   - line: The line number in the original source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the original source, or null.  The
	*     column number is 0-based.
	*   - name: The original identifier, or null.
	*/
	IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
		var needle = {
			generatedLine: util.getArg(aArgs, "line"),
			generatedColumn: util.getArg(aArgs, "column")
		};
		var sectionIndex = binarySearch.search(needle, this._sections, function(needle, section) {
			var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
			if (cmp) return cmp;
			return needle.generatedColumn - section.generatedOffset.generatedColumn;
		});
		var section = this._sections[sectionIndex];
		if (!section) return {
			source: null,
			line: null,
			column: null,
			name: null
		};
		return section.consumer.originalPositionFor({
			line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
			column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
			bias: aArgs.bias
		});
	};
	/**
	* Return true if we have the source content for every source in the source
	* map, false otherwise.
	*/
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
		return this._sections.every(function(s) {
			return s.consumer.hasContentsOfAllSources();
		});
	};
	/**
	* Returns the original source content. The only argument is the url of the
	* original source file. Returns null if no original source content is
	* available.
	*/
	IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
		for (var i = 0; i < this._sections.length; i++) {
			var content = this._sections[i].consumer.sourceContentFor(aSource, true);
			if (content || content === "") return content;
		}
		if (nullOnMissing) return null;
		else throw new Error("\"" + aSource + "\" is not in the SourceMap.");
	};
	/**
	* Returns the generated line and column information for the original source,
	* line, and column positions provided. The only argument is an object with
	* the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number
	*     is 1-based.
	*   - column: The column number in the original source.  The column
	*     number is 0-based.
	*
	* and an object is returned with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*     line number is 1-based. 
	*   - column: The column number in the generated source, or null.
	*     The column number is 0-based.
	*/
	IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
		for (var i = 0; i < this._sections.length; i++) {
			var section = this._sections[i];
			if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) continue;
			var generatedPosition = section.consumer.generatedPositionFor(aArgs);
			if (generatedPosition) return {
				line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
				column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
			};
		}
		return {
			line: null,
			column: null
		};
	};
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		this.__generatedMappings = [];
		this.__originalMappings = [];
		for (var i = 0; i < this._sections.length; i++) {
			var section = this._sections[i];
			var sectionMappings = section.consumer._generatedMappings;
			for (var j = 0; j < sectionMappings.length; j++) {
				var mapping = sectionMappings[j];
				var source = section.consumer._sources.at(mapping.source);
				if (source !== null) source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
				this._sources.add(source);
				source = this._sources.indexOf(source);
				var name = null;
				if (mapping.name) {
					name = section.consumer._names.at(mapping.name);
					this._names.add(name);
					name = this._names.indexOf(name);
				}
				var adjustedMapping = {
					source,
					generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
					generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
					originalLine: mapping.originalLine,
					originalColumn: mapping.originalColumn,
					name
				};
				this.__generatedMappings.push(adjustedMapping);
				if (typeof adjustedMapping.originalLine === "number") this.__originalMappings.push(adjustedMapping);
			}
		}
		quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
		quickSort(this.__originalMappings, util.compareByOriginalPositions);
	};
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
}));
//#endregion
//#region ../../node_modules/source-map-js/lib/source-node.js
var require_source_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
	var util = require_util();
	var REGEX_NEWLINE = /(\r?\n)/;
	var NEWLINE_CODE = 10;
	var isSourceNode = "$$$isSourceNode$$$";
	/**
	* SourceNodes provide a way to abstract over interpolating/concatenating
	* snippets of generated JavaScript source code while maintaining the line and
	* column information associated with the original source code.
	*
	* @param aLine The original line number.
	* @param aColumn The original column number.
	* @param aSource The original source's filename.
	* @param aChunks Optional. An array of strings which are snippets of
	*        generated JS, or other SourceNodes.
	* @param aName The original identifier.
	*/
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
		this.children = [];
		this.sourceContents = {};
		this.line = aLine == null ? null : aLine;
		this.column = aColumn == null ? null : aColumn;
		this.source = aSource == null ? null : aSource;
		this.name = aName == null ? null : aName;
		this[isSourceNode] = true;
		if (aChunks != null) this.add(aChunks);
	}
	/**
	* Creates a SourceNode from generated code and a SourceMapConsumer.
	*
	* @param aGeneratedCode The generated code
	* @param aSourceMapConsumer The SourceMap for the generated code
	* @param aRelativePath Optional. The path that relative sources in the
	*        SourceMapConsumer should be relative to.
	*/
	SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
		var node = new SourceNode();
		var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
		var remainingLinesIndex = 0;
		var shiftNextLine = function() {
			return getNextLine() + (getNextLine() || "");
			function getNextLine() {
				return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
			}
		};
		var lastGeneratedLine = 1, lastGeneratedColumn = 0;
		var lastMapping = null;
		aSourceMapConsumer.eachMapping(function(mapping) {
			if (lastMapping !== null) {
				if (lastGeneratedLine < mapping.generatedLine) {
					addMappingWithCode(lastMapping, shiftNextLine());
					lastGeneratedLine++;
					lastGeneratedColumn = 0;
				} else {
					var nextLine = remainingLines[remainingLinesIndex] || "";
					var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
					remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
					lastGeneratedColumn = mapping.generatedColumn;
					addMappingWithCode(lastMapping, code);
					lastMapping = mapping;
					return;
				}
			}
			while (lastGeneratedLine < mapping.generatedLine) {
				if (remainingLinesIndex >= remainingLines.length) {
					lastGeneratedLine = mapping.generatedLine;
					break;
				}
				node.add(shiftNextLine());
				lastGeneratedLine++;
			}
			if (lastGeneratedColumn < mapping.generatedColumn) {
				var nextLine = remainingLines[remainingLinesIndex] || "";
				node.add(nextLine.substr(0, mapping.generatedColumn));
				remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
				lastGeneratedColumn = mapping.generatedColumn;
			}
			lastMapping = mapping;
		}, this);
		if (remainingLinesIndex < remainingLines.length) {
			if (lastMapping) addMappingWithCode(lastMapping, shiftNextLine());
			node.add(remainingLines.splice(remainingLinesIndex).join(""));
		}
		aSourceMapConsumer.sources.forEach(function(sourceFile) {
			var content = aSourceMapConsumer.sourceContentFor(sourceFile);
			if (content != null) {
				if (aRelativePath != null) sourceFile = util.join(aRelativePath, sourceFile);
				node.setSourceContent(sourceFile, content);
			}
		});
		return node;
		function addMappingWithCode(mapping, code) {
			if (mapping === null || mapping.source === void 0) node.add(code);
			else {
				var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
				node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
			}
		}
	};
	/**
	* Add a chunk of generated JS to this source node.
	*
	* @param aChunk A string snippet of generated JS code, another instance of
	*        SourceNode, or an array where each member is one of those things.
	*/
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
		if (Array.isArray(aChunk)) aChunk.forEach(function(chunk) {
			this.add(chunk);
		}, this);
		else if (aChunk[isSourceNode] || typeof aChunk === "string") {
			if (aChunk) this.children.push(aChunk);
		} else throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
		return this;
	};
	/**
	* Add a chunk of generated JS to the beginning of this source node.
	*
	* @param aChunk A string snippet of generated JS code, another instance of
	*        SourceNode, or an array where each member is one of those things.
	*/
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
		if (Array.isArray(aChunk)) for (var i = aChunk.length - 1; i >= 0; i--) this.prepend(aChunk[i]);
		else if (aChunk[isSourceNode] || typeof aChunk === "string") this.children.unshift(aChunk);
		else throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
		return this;
	};
	/**
	* Walk over the tree of JS snippets in this node and its children. The
	* walking function is called once for each snippet of JS and is passed that
	* snippet and the its original associated source's line/column location.
	*
	* @param aFn The traversal function.
	*/
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
		var chunk;
		for (var i = 0, len = this.children.length; i < len; i++) {
			chunk = this.children[i];
			if (chunk[isSourceNode]) chunk.walk(aFn);
			else if (chunk !== "") aFn(chunk, {
				source: this.source,
				line: this.line,
				column: this.column,
				name: this.name
			});
		}
	};
	/**
	* Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	* each of `this.children`.
	*
	* @param aSep The separator.
	*/
	SourceNode.prototype.join = function SourceNode_join(aSep) {
		var newChildren;
		var i;
		var len = this.children.length;
		if (len > 0) {
			newChildren = [];
			for (i = 0; i < len - 1; i++) {
				newChildren.push(this.children[i]);
				newChildren.push(aSep);
			}
			newChildren.push(this.children[i]);
			this.children = newChildren;
		}
		return this;
	};
	/**
	* Call String.prototype.replace on the very right-most source snippet. Useful
	* for trimming whitespace from the end of a source node, etc.
	*
	* @param aPattern The pattern to replace.
	* @param aReplacement The thing to replace the pattern with.
	*/
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
		var lastChild = this.children[this.children.length - 1];
		if (lastChild[isSourceNode]) lastChild.replaceRight(aPattern, aReplacement);
		else if (typeof lastChild === "string") this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
		else this.children.push("".replace(aPattern, aReplacement));
		return this;
	};
	/**
	* Set the source content for a source file. This will be added to the SourceMapGenerator
	* in the sourcesContent field.
	*
	* @param aSourceFile The filename of the source file
	* @param aSourceContent The content of the source file
	*/
	SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
		this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	};
	/**
	* Walk over the tree of SourceNodes. The walking function is called for each
	* source file content and is passed the filename and source content.
	*
	* @param aFn The traversal function.
	*/
	SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
		for (var i = 0, len = this.children.length; i < len; i++) if (this.children[i][isSourceNode]) this.children[i].walkSourceContents(aFn);
		var sources = Object.keys(this.sourceContents);
		for (var i = 0, len = sources.length; i < len; i++) aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	};
	/**
	* Return the string representation of this source node. Walks over the tree
	* and concatenates all the various snippets together to one string.
	*/
	SourceNode.prototype.toString = function SourceNode_toString() {
		var str = "";
		this.walk(function(chunk) {
			str += chunk;
		});
		return str;
	};
	/**
	* Returns the string representation of this source node along with a source
	* map.
	*/
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
		var generated = {
			code: "",
			line: 1,
			column: 0
		};
		var map = new SourceMapGenerator(aArgs);
		var sourceMappingActive = false;
		var lastOriginalSource = null;
		var lastOriginalLine = null;
		var lastOriginalColumn = null;
		var lastOriginalName = null;
		this.walk(function(chunk, original) {
			generated.code += chunk;
			if (original.source !== null && original.line !== null && original.column !== null) {
				if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) map.addMapping({
					source: original.source,
					original: {
						line: original.line,
						column: original.column
					},
					generated: {
						line: generated.line,
						column: generated.column
					},
					name: original.name
				});
				lastOriginalSource = original.source;
				lastOriginalLine = original.line;
				lastOriginalColumn = original.column;
				lastOriginalName = original.name;
				sourceMappingActive = true;
			} else if (sourceMappingActive) {
				map.addMapping({ generated: {
					line: generated.line,
					column: generated.column
				} });
				lastOriginalSource = null;
				sourceMappingActive = false;
			}
			for (var idx = 0, length = chunk.length; idx < length; idx++) if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
				generated.line++;
				generated.column = 0;
				if (idx + 1 === length) {
					lastOriginalSource = null;
					sourceMappingActive = false;
				} else if (sourceMappingActive) map.addMapping({
					source: original.source,
					original: {
						line: original.line,
						column: original.column
					},
					generated: {
						line: generated.line,
						column: generated.column
					},
					name: original.name
				});
			} else generated.column++;
		});
		this.walkSourceContents(function(sourceFile, sourceContent) {
			map.setSourceContent(sourceFile, sourceContent);
		});
		return {
			code: generated.code,
			map
		};
	};
	exports.SourceNode = SourceNode;
}));
//#endregion
//#region ../../node_modules/source-map-js/source-map.js
var require_source_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
	exports.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
	exports.SourceNode = require_source_node().SourceNode;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/previous-map.js
var require_previous_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let { existsSync, readFileSync, realpathSync } = __require("fs");
	let { dirname: dirname$2, isAbsolute: isAbsolute$1, join: join$1, relative: relative$2, sep: sep$2 } = __require("path");
	let { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	function realPath(path) {
		try {
			return realpathSync(path);
		} catch {
			return path;
		}
	}
	function fromBase64(str) {
		if (Buffer) return Buffer.from(str, "base64").toString();
		else
 /* c8 ignore next 2 */
		return window.atob(str);
	}
	var PreviousMap = class {
		constructor(css, opts) {
			if (opts.map === false) return;
			if (opts.unsafeMap) this.unsafeMap = true;
			this.loadAnnotation(css);
			this.inline = this.startWith(this.annotation, "data:");
			let prev = opts.map ? opts.map.prev : void 0;
			let text = this.loadMap(opts.from, prev);
			if (!this.mapFile && opts.from) this.mapFile = opts.from;
			if (this.mapFile) this.root = dirname$2(this.mapFile);
			if (text) this.text = text;
		}
		consumer() {
			if (!this.consumerCache) this.consumerCache = new SourceMapConsumer(this.json || this.text);
			return this.consumerCache;
		}
		decodeInline(text) {
			let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
			let baseUri = /^data:application\/json;base64,/;
			let uriMatch = text.match(/^data:application\/json;charset=utf-?8,/) || text.match(/^data:application\/json,/);
			if (uriMatch) return decodeURIComponent(text.substr(uriMatch[0].length));
			let baseUriMatch = text.match(baseCharsetUri) || text.match(baseUri);
			if (baseUriMatch) return fromBase64(text.substr(baseUriMatch[0].length));
			let encoding = text.slice(22);
			encoding = encoding.slice(0, encoding.indexOf(","));
			throw new Error("Unsupported source map encoding " + encoding);
		}
		getAnnotationURL(sourceMapString) {
			return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
		}
		isMap(map) {
			if (typeof map !== "object") return false;
			return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
		}
		loadAnnotation(css) {
			let comments = css.match(/\/\*\s*# sourceMappingURL=/g);
			if (!comments) return;
			let start = css.lastIndexOf(comments.pop());
			let end = css.indexOf("*/", start);
			if (start > -1 && end > -1) this.annotation = this.getAnnotationURL(css.substring(start, end));
		}
		loadFile(path, cssFile, trusted) {
			if (!trusted && !this.unsafeMap) {
				if (!/\.map$/i.test(path)) return void 0;
				if (!cssFile) return void 0;
				let rel = relative$2(realPath(dirname$2(cssFile)), realPath(path));
				if (rel === ".." || rel.startsWith(".." + sep$2) || isAbsolute$1(rel)) return;
			}
			this.root = dirname$2(path);
			if (existsSync(path)) {
				this.mapFile = path;
				return readFileSync(path, "utf-8").toString().trim();
			}
		}
		loadMap(file, prev) {
			if (prev === false) return false;
			if (prev) {
				if (typeof prev === "string") return prev;
				else if (typeof prev === "function") {
					let prevPath = prev(file);
					if (prevPath) {
						let map = this.loadFile(prevPath, file, true);
						if (!map) throw new Error("Unable to load previous source map: " + prevPath.toString());
						return map;
					}
				} else if (prev instanceof SourceMapConsumer) return SourceMapGenerator.fromSourceMap(prev).toString();
				else if (prev instanceof SourceMapGenerator) return prev.toString();
				else if (this.isMap(prev)) return JSON.stringify(prev);
				else throw new Error("Unsupported previous source map format: " + prev.toString());
			} else if (this.inline) return this.decodeInline(this.annotation);
			else if (this.annotation) {
				let map = this.annotation;
				if (file) map = join$1(dirname$2(file), map);
				let unknown = this.loadFile(map, file, false);
				if (unknown) try {
					/* c8 ignore next 4 */
					this.json = JSON.parse(unknown.replace(/^\)]}'[^\n]*\n/, ""));
				} catch {
					return;
				}
				return unknown;
			}
		}
		startWith(string, start) {
			if (!string) return false;
			return string.substr(0, start.length) === start;
		}
		withContent() {
			return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
		}
	};
	module.exports = PreviousMap;
	PreviousMap.default = PreviousMap;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/input.js
var require_input = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let { nanoid } = require_non_secure();
	let { isAbsolute, resolve: resolve$2 } = __require("path");
	let { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	let { fileURLToPath, pathToFileURL: pathToFileURL$1 } = __require("url");
	let CssSyntaxError = require_css_syntax_error();
	let PreviousMap = require_previous_map();
	let terminalHighlight = require_terminal_highlight();
	let lineToIndexCache = Symbol("lineToIndexCache");
	let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	let pathAvailable = Boolean(resolve$2 && isAbsolute);
	function getLineToIndex(input) {
		if (input[lineToIndexCache]) return input[lineToIndexCache];
		let lines = input.css.split("\n");
		let lineToIndex = new Array(lines.length);
		let prevIndex = 0;
		for (let i = 0, l = lines.length; i < l; i++) {
			lineToIndex[i] = prevIndex;
			prevIndex += lines[i].length + 1;
		}
		input[lineToIndexCache] = lineToIndex;
		return lineToIndex;
	}
	var Input = class {
		get from() {
			return this.file || this.id;
		}
		constructor(css, opts = {}) {
			if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) throw new Error(`PostCSS received ${css} instead of CSS string`);
			this.css = css.toString();
			if (this.css[0] === "﻿" || this.css[0] === "￾") {
				this.hasBOM = true;
				this.css = this.css.slice(1);
			} else this.hasBOM = false;
			this.document = this.css;
			if (opts.document) this.document = opts.document.toString();
			if (opts.from) {
				if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) this.file = opts.from;
				else this.file = resolve$2(opts.from);
			}
			if (pathAvailable && sourceMapAvailable) {
				let map = new PreviousMap(this.css, opts);
				if (map.text) {
					this.map = map;
					let file = map.consumer().file;
					if (!this.file && file) this.file = this.mapResolve(file);
				}
			}
			if (!this.file) this.id = "<input css " + nanoid(6) + ">";
			if (this.map) this.map.file = this.from;
		}
		error(message, line, column, opts = {}) {
			let endColumn, endLine, endOffset, offset, result;
			if (line && typeof line === "object") {
				let start = line;
				let end = column;
				if (typeof start.offset === "number") {
					offset = start.offset;
					let pos = this.fromOffset(offset);
					line = pos.line;
					column = pos.col;
				} else {
					line = start.line;
					column = start.column;
					offset = this.fromLineAndColumn(line, column);
				}
				if (typeof end.offset === "number") {
					endOffset = end.offset;
					let pos = this.fromOffset(endOffset);
					endLine = pos.line;
					endColumn = pos.col;
				} else {
					endLine = end.line;
					endColumn = end.column;
					endOffset = this.fromLineAndColumn(end.line, end.column);
				}
			} else if (!column) {
				offset = line;
				let pos = this.fromOffset(offset);
				line = pos.line;
				column = pos.col;
			} else offset = this.fromLineAndColumn(line, column);
			let origin = this.origin(line, column, endLine, endColumn);
			if (origin) result = new CssSyntaxError(message, origin.endLine === void 0 ? origin.line : {
				column: origin.column,
				line: origin.line
			}, origin.endLine === void 0 ? origin.column : {
				column: origin.endColumn,
				line: origin.endLine
			}, origin.source, origin.file, opts.plugin);
			else result = new CssSyntaxError(message, endLine === void 0 ? line : {
				column,
				line
			}, endLine === void 0 ? column : {
				column: endColumn,
				line: endLine
			}, this.css, this.file, opts.plugin);
			result.input = {
				column,
				endColumn,
				endLine,
				endOffset,
				line,
				offset,
				source: this.css
			};
			if (this.file) {
				if (pathToFileURL$1) result.input.url = pathToFileURL$1(this.file).toString();
				result.input.file = this.file;
			}
			return result;
		}
		fromLineAndColumn(line, column) {
			return getLineToIndex(this)[line - 1] + column - 1;
		}
		fromOffset(offset) {
			let lineToIndex = getLineToIndex(this);
			let lastLine = lineToIndex[lineToIndex.length - 1];
			let min = 0;
			if (offset >= lastLine) min = lineToIndex.length - 1;
			else {
				let max = lineToIndex.length - 2;
				let mid;
				while (min < max) {
					mid = min + (max - min >> 1);
					if (offset < lineToIndex[mid]) max = mid - 1;
					else if (offset >= lineToIndex[mid + 1]) min = mid + 1;
					else {
						min = mid;
						break;
					}
				}
			}
			return {
				col: offset - lineToIndex[min] + 1,
				line: min + 1
			};
		}
		mapResolve(file) {
			if (/^\w+:\/\//.test(file)) return file;
			return resolve$2(this.map.consumer().sourceRoot || this.map.root || ".", file);
		}
		origin(line, column, endLine, endColumn) {
			if (!this.map) return false;
			let consumer = this.map.consumer();
			let from = consumer.originalPositionFor({
				column: column - 1,
				line
			});
			if (!from.source) return false;
			let to;
			if (typeof endLine === "number") {
				let toPosition = consumer.originalPositionFor({
					column: endColumn - 1,
					line: endLine
				});
				if (toPosition.source) to = toPosition;
			}
			let fromUrl;
			if (isAbsolute(from.source)) fromUrl = pathToFileURL$1(from.source);
			else fromUrl = new URL(from.source, this.map.consumer().sourceRoot || pathToFileURL$1(this.map.mapFile));
			let result = {
				column: from.column + 1,
				endColumn: to && to.column + 1,
				endLine: to && to.line,
				line: from.line,
				url: fromUrl.toString()
			};
			if (fromUrl.protocol === "file:") {
				if (fileURLToPath) result.file = fileURLToPath(fromUrl);
				else
 /* c8 ignore next 2 */
				throw new Error(`file: protocol is not available in this PostCSS build`);
			}
			let source = consumer.sourceContentFor(from.source);
			if (source) result.source = source;
			return result;
		}
		toJSON() {
			let json = {};
			for (let name of [
				"hasBOM",
				"css",
				"file",
				"id"
			]) if (this[name] != null) json[name] = this[name];
			if (this.map) {
				json.map = { ...this.map };
				if (json.map.consumerCache) json.map.consumerCache = void 0;
			}
			return json;
		}
	};
	module.exports = Input;
	Input.default = Input;
	if (terminalHighlight && terminalHighlight.registerInput) terminalHighlight.registerInput(Input);
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/root.js
var require_root = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let LazyResult;
	let Processor;
	var Root = class extends Container {
		constructor(defaults) {
			super(defaults);
			this.type = "root";
			if (!this.nodes) this.nodes = [];
		}
		normalize(child, sample, type) {
			let keepBefore = /* @__PURE__ */ new Set();
			for (let node of Array.isArray(child) ? child : [child]) if (node && typeof node === "object" && !node.parent && node.raws && typeof node.raws.before !== "undefined") keepBefore.add(node.raws);
			let nodes = super.normalize(child);
			if (sample) {
				if (type === "prepend") {
					if (this.nodes.length > 1) sample.raws.before = this.nodes[1].raws.before;
					else delete sample.raws.before;
				} else if (this.first !== sample) {
					for (let node of nodes) if (!keepBefore.has(node.raws)) node.raws.before = sample.raws.before;
				}
			}
			return nodes;
		}
		removeChild(child, ignore) {
			let index = this.index(child);
			if (!ignore && index === 0 && this.nodes.length > 1) this.nodes[1].raws.before = this.nodes[index].raws.before;
			return super.removeChild(child);
		}
		toResult(opts = {}) {
			return new LazyResult(new Processor(), this, opts).stringify();
		}
	};
	Root.registerLazyResult = (dependant) => {
		LazyResult = dependant;
	};
	Root.registerProcessor = (dependant) => {
		Processor = dependant;
	};
	module.exports = Root;
	Root.default = Root;
	Container.registerRoot(Root);
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/list.js
var require_list = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let list = {
		comma(string) {
			return list.split(string, [","], true);
		},
		space(string) {
			return list.split(string, [
				" ",
				"\n",
				"	"
			]);
		},
		split(string, separators, last) {
			if (typeof string !== "string") return [];
			let array = [];
			let current = "";
			let split = false;
			let func = 0;
			let inQuote = false;
			let prevQuote = "";
			let escape = false;
			for (let letter of string) {
				if (escape) escape = false;
				else if (letter === "\\") escape = true;
				else if (inQuote) {
					if (letter === prevQuote) inQuote = false;
				} else if (letter === "\"" || letter === "'") {
					inQuote = true;
					prevQuote = letter;
				} else if (letter === "(") func += 1;
				else if (letter === ")") {
					if (func > 0) func -= 1;
				} else if (func === 0) {
					if (separators.includes(letter)) split = true;
				}
				if (split) {
					let value = current.trim();
					if (last || value !== "") array.push(value);
					current = "";
					split = false;
				} else current += letter;
			}
			let value = current.trim();
			if (last || value !== "") array.push(value);
			return array;
		}
	};
	module.exports = list;
	list.default = list;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/rule.js
var require_rule = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let list = require_list();
	var Rule = class extends Container {
		get selectors() {
			return list.comma(this.selector);
		}
		set selectors(values) {
			let match = this.selector ? this.selector.match(/,\s*/) : null;
			let sep = match ? match[0] : "," + this.raw("between", "beforeOpen");
			this.selector = values.join(sep);
		}
		constructor(defaults) {
			super(defaults);
			this.type = "rule";
			if (!this.nodes) this.nodes = [];
		}
	};
	module.exports = Rule;
	Rule.default = Rule;
	Container.registerRule(Rule);
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/fromJSON.js
var require_fromJSON = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let AtRule = require_at_rule();
	let Comment = require_comment();
	let Declaration = require_declaration();
	let Input = require_input();
	let PreviousMap = require_previous_map();
	let Root = require_root();
	let Rule = require_rule();
	function hydrateInputs(json, inputs) {
		if (!json.inputs) return inputs;
		return json.inputs.map((input) => {
			let inputHydrated = {
				...input,
				__proto__: Input.prototype
			};
			if (inputHydrated.map) inputHydrated.map = {
				...inputHydrated.map,
				__proto__: PreviousMap.prototype
			};
			return inputHydrated;
		});
	}
	function constructNode(json, inputs, children) {
		let defaults = { ...json };
		delete defaults.inputs;
		delete defaults.nodes;
		if (defaults.source) {
			let { inputId, ...source } = defaults.source;
			defaults.source = source;
			if (inputId != null) defaults.source.input = inputs[inputId];
		}
		let node;
		if (defaults.type === "root") node = new Root(defaults);
		else if (defaults.type === "decl") node = new Declaration(defaults);
		else if (defaults.type === "rule") node = new Rule(defaults);
		else if (defaults.type === "comment") node = new Comment(defaults);
		else if (defaults.type === "atrule") node = new AtRule(defaults);
		else throw new Error("Unknown node type: " + json.type);
		if (children) {
			node.nodes = children;
			for (let child of children) child.parent = node;
		}
		return node;
	}
	function fromJSON(json, inputs) {
		if (Array.isArray(json)) return json.map((n) => fromJSON(n));
		let result;
		let stack = [{
			childIndex: 0,
			children: [],
			inputs: hydrateInputs(json, inputs),
			json
		}];
		while (stack.length > 0) {
			let frame = stack[stack.length - 1];
			let jsonNodes = frame.json.nodes;
			if (jsonNodes && frame.childIndex < jsonNodes.length) {
				let childJson = jsonNodes[frame.childIndex];
				frame.childIndex += 1;
				stack.push({
					childIndex: 0,
					children: [],
					inputs: hydrateInputs(childJson, frame.inputs),
					json: childJson
				});
				continue;
			}
			stack.pop();
			let node = constructNode(frame.json, frame.inputs, jsonNodes ? frame.children : void 0);
			if (stack.length > 0) stack[stack.length - 1].children.push(node);
			else result = node;
		}
		return result;
	}
	module.exports = fromJSON;
	fromJSON.default = fromJSON;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/map-generator.js
var require_map_generator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let { dirname: dirname$1, relative: relative$1, resolve: resolve$1, sep: sep$1 } = __require("path");
	let { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	let { pathToFileURL } = __require("url");
	let Input = require_input();
	let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	let pathAvailable = Boolean(dirname$1 && resolve$1 && relative$1 && sep$1);
	var MapGenerator = class {
		constructor(stringify, root, opts, cssString) {
			this.stringify = stringify;
			this.mapOpts = opts.map || {};
			this.root = root;
			this.opts = opts;
			this.css = cssString;
			this.originalCSS = cssString;
			this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
			this.memoizedFileURLs = /* @__PURE__ */ new Map();
			this.memoizedPaths = /* @__PURE__ */ new Map();
			this.memoizedURLs = /* @__PURE__ */ new Map();
		}
		addAnnotation() {
			let content;
			if (this.isInline()) content = "data:application/json;base64," + this.toBase64(this.map.toString());
			else if (typeof this.mapOpts.annotation === "string") content = this.mapOpts.annotation;
			else if (typeof this.mapOpts.annotation === "function") content = this.mapOpts.annotation(this.opts.to, this.root);
			else content = this.outputFile() + ".map";
			let eol = "\n";
			if (this.css.includes("\r\n")) eol = "\r\n";
			this.css += eol + "/*# sourceMappingURL=" + content + " */";
		}
		applyPrevMaps() {
			for (let prev of this.previous()) {
				let from = this.toUrl(this.path(prev.file));
				let root = prev.root || dirname$1(prev.file);
				let map;
				if (this.mapOpts.sourcesContent === false) {
					map = new SourceMapConsumer(prev.text);
					if (map.sourcesContent) map.sourcesContent = null;
				} else map = prev.consumer();
				this.map.applySourceMap(map, from, this.toUrl(this.path(root)));
			}
		}
		clearAnnotation() {
			if (this.mapOpts.annotation === false) return;
			if (this.root) {
				let node;
				for (let i = this.root.nodes.length - 1; i >= 0; i--) {
					node = this.root.nodes[i];
					if (node.type !== "comment") continue;
					if (node.text.startsWith("# sourceMappingURL=")) this.root.removeChild(i);
				}
			} else if (this.css) {
				let annotation = "/*# sourceMappingURL=";
				let startIndex;
				while ((startIndex = this.css.lastIndexOf(annotation)) !== -1) {
					let endIndex = this.css.indexOf("*/", startIndex + 21);
					if (endIndex === -1) break;
					while (startIndex > 0 && this.css[startIndex - 1] === "\n") startIndex--;
					this.css = this.css.slice(0, startIndex) + this.css.slice(endIndex + 2);
				}
			}
		}
		generate() {
			this.clearAnnotation();
			if (pathAvailable && sourceMapAvailable && this.isMap()) return this.generateMap();
			else {
				let result = "";
				this.stringify(this.root, (i) => {
					result += i;
				});
				return [result];
			}
		}
		generateMap() {
			if (this.root) this.generateString();
			else if (this.previous().length === 1) {
				let prev = this.previous()[0].consumer();
				prev.file = this.outputFile();
				this.map = SourceMapGenerator.fromSourceMap(prev, { ignoreInvalidMapping: true });
			} else {
				this.map = new SourceMapGenerator({
					file: this.outputFile(),
					ignoreInvalidMapping: true
				});
				this.map.addMapping({
					generated: {
						column: 0,
						line: 1
					},
					original: {
						column: 0,
						line: 1
					},
					source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
				});
			}
			if (this.isSourcesContent()) this.setSourcesContent();
			if (this.root && this.previous().length > 0) this.applyPrevMaps();
			if (this.isAnnotation()) this.addAnnotation();
			if (this.isInline()) return [this.css];
			else return [this.css, this.map];
		}
		generateString() {
			this.css = "";
			this.map = new SourceMapGenerator({
				file: this.outputFile(),
				ignoreInvalidMapping: true
			});
			let line = 1;
			let column = 1;
			let noSource = "<no source>";
			let mapping = {
				generated: {
					column: 0,
					line: 0
				},
				original: {
					column: 0,
					line: 0
				},
				source: ""
			};
			let last, lines;
			this.stringify(this.root, (str, node, type) => {
				this.css += str;
				if (node && type !== "end") {
					mapping.generated.line = line;
					mapping.generated.column = column - 1;
					if (node.source && node.source.start) {
						mapping.source = this.sourcePath(node);
						mapping.original.line = node.source.start.line;
						mapping.original.column = node.source.start.column - 1;
						this.map.addMapping(mapping);
					} else {
						mapping.source = noSource;
						mapping.original.line = 1;
						mapping.original.column = 0;
						this.map.addMapping(mapping);
					}
				}
				lines = str.match(/\n/g);
				if (lines) {
					line += lines.length;
					last = str.lastIndexOf("\n");
					column = str.length - last;
				} else column += str.length;
				if (node && type !== "start") {
					let p = node.parent || { raws: {} };
					if (!(node.type === "decl" || node.type === "atrule" && !node.nodes) || node !== p.last || p.raws.semicolon) {
						if (node.source && node.source.end) {
							mapping.source = this.sourcePath(node);
							mapping.original.line = node.source.end.line;
							mapping.original.column = node.source.end.column - 1;
							mapping.generated.line = line;
							mapping.generated.column = column - 2;
							this.map.addMapping(mapping);
						} else {
							mapping.source = noSource;
							mapping.original.line = 1;
							mapping.original.column = 0;
							mapping.generated.line = line;
							mapping.generated.column = column - 1;
							this.map.addMapping(mapping);
						}
					}
				}
			});
		}
		isAnnotation() {
			if (this.isInline()) return true;
			if (typeof this.mapOpts.annotation !== "undefined") return this.mapOpts.annotation;
			if (this.previous().length) return this.previous().some((i) => i.annotation);
			return true;
		}
		isInline() {
			if (typeof this.mapOpts.inline !== "undefined") return this.mapOpts.inline;
			let annotation = this.mapOpts.annotation;
			if (typeof annotation !== "undefined" && annotation !== true) return false;
			if (this.previous().length) return this.previous().some((i) => i.inline);
			return true;
		}
		isMap() {
			if (typeof this.opts.map !== "undefined") return !!this.opts.map;
			return this.previous().length > 0;
		}
		isSourcesContent() {
			if (typeof this.mapOpts.sourcesContent !== "undefined") return this.mapOpts.sourcesContent;
			if (this.previous().length) return this.previous().some((i) => i.withContent());
			return true;
		}
		outputFile() {
			if (this.opts.to) return this.path(this.opts.to);
			else if (this.opts.from) return this.path(this.opts.from);
			else return "to.css";
		}
		path(file) {
			if (this.mapOpts.absolute) return file;
			if (file.charCodeAt(0) === 60) return file;
			if (/^\w+:\/\//.test(file)) return file;
			let cached = this.memoizedPaths.get(file);
			if (cached) return cached;
			let from = this.opts.to ? dirname$1(this.opts.to) : ".";
			if (typeof this.mapOpts.annotation === "string") from = dirname$1(resolve$1(from, this.mapOpts.annotation));
			let path = relative$1(from, file);
			this.memoizedPaths.set(file, path);
			return path;
		}
		previous() {
			if (!this.previousMaps) {
				this.previousMaps = [];
				if (this.root) this.root.walk((node) => {
					if (node.source && node.source.input.map) {
						let map = node.source.input.map;
						if (!this.previousMaps.includes(map)) this.previousMaps.push(map);
					}
				});
				else {
					let input = new Input(this.originalCSS, this.opts);
					if (input.map) this.previousMaps.push(input.map);
				}
			}
			return this.previousMaps;
		}
		setSourcesContent() {
			let already = {};
			if (this.root) this.root.walk((node) => {
				if (node.source) {
					let from = node.source.input.from;
					if (from && !already[from]) {
						already[from] = true;
						let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
						this.map.setSourceContent(fromUrl, node.source.input.css);
					}
				}
			});
			else if (this.css) {
				let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
				this.map.setSourceContent(from, this.css);
			}
		}
		sourcePath(node) {
			if (this.mapOpts.from) return this.toUrl(this.mapOpts.from);
			else if (this.usesFileUrls) return this.toFileUrl(node.source.input.from);
			else return this.toUrl(this.path(node.source.input.from));
		}
		toBase64(str) {
			if (Buffer) return Buffer.from(str).toString("base64");
			else return window.btoa(unescape(encodeURIComponent(str)));
		}
		toFileUrl(path) {
			let cached = this.memoizedFileURLs.get(path);
			if (cached) return cached;
			if (pathToFileURL) {
				let fileURL = pathToFileURL(path).toString();
				this.memoizedFileURLs.set(path, fileURL);
				return fileURL;
			} else throw new Error("`map.absolute` option is not available in this PostCSS build");
		}
		toUrl(path) {
			let cached = this.memoizedURLs.get(path);
			if (cached) return cached;
			if (sep$1 === "\\") path = path.replace(/\\/g, "/");
			let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
			this.memoizedURLs.set(path, url);
			return url;
		}
	};
	module.exports = MapGenerator;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let AtRule = require_at_rule();
	let Comment = require_comment();
	let Declaration = require_declaration();
	let Root = require_root();
	let Rule = require_rule();
	let tokenizer = require_tokenize();
	const SAFE_COMMENT_NEIGHBOR = {
		empty: true,
		space: true
	};
	function findLastWithPosition(tokens) {
		for (let i = tokens.length - 1; i >= 0; i--) {
			let token = tokens[i];
			let pos = token[3] || token[2];
			if (pos) return pos;
		}
	}
	function tokensToString(tokens, from, to) {
		let result = "";
		for (let i = from; i < to; i++) result += tokens[i][1];
		return result;
	}
	var Parser = class {
		constructor(input) {
			this.input = input;
			this.root = new Root();
			this.current = this.root;
			this.spaces = "";
			this.semicolon = false;
			this.createTokenizer();
			this.root.source = {
				input,
				start: {
					column: 1,
					line: 1,
					offset: 0
				}
			};
		}
		atrule(token) {
			let node = new AtRule();
			node.name = token[1].slice(1);
			if (node.name === "") this.unnamedAtrule(node, token);
			this.init(node, token[2]);
			let type;
			let prev;
			let shift;
			let last = false;
			let open = false;
			let params = [];
			let brackets = [];
			while (!this.tokenizer.endOfFile()) {
				token = this.tokenizer.nextToken();
				type = token[0];
				if (type === "(" || type === "[") brackets.push(type === "(" ? ")" : "]");
				else if (type === "{" && brackets.length > 0) brackets.push("}");
				else if (type === brackets[brackets.length - 1]) brackets.pop();
				if (brackets.length === 0) {
					if (type === ";") {
						node.source.end = this.getPosition(token[2]);
						node.source.end.offset++;
						this.semicolon = true;
						break;
					} else if (type === "{") {
						open = true;
						break;
					} else if (type === "}") {
						if (params.length > 0) {
							shift = params.length - 1;
							prev = params[shift];
							while (prev && prev[0] === "space") prev = params[--shift];
							if (prev) {
								node.source.end = this.getPosition(prev[3] || prev[2]);
								node.source.end.offset++;
							}
						}
						this.end(token);
						break;
					} else params.push(token);
				} else params.push(token);
				if (this.tokenizer.endOfFile()) {
					last = true;
					break;
				}
			}
			node.raws.between = this.spacesAndCommentsFromEnd(params);
			if (params.length) {
				node.raws.afterName = this.spacesAndCommentsFromStart(params);
				this.raw(node, "params", params);
				if (last) {
					token = params[params.length - 1];
					node.source.end = this.getPosition(token[3] || token[2]);
					node.source.end.offset++;
					this.spaces = node.raws.between;
					node.raws.between = "";
				}
			} else {
				node.raws.afterName = "";
				node.params = "";
			}
			if (open) {
				node.nodes = [];
				this.current = node;
			}
		}
		checkMissedSemicolon(tokens) {
			let colon = this.colon(tokens);
			if (colon === false) return;
			let founded = 0;
			let token;
			for (let j = colon - 1; j >= 0; j--) {
				token = tokens[j];
				if (token[0] !== "space") {
					founded += 1;
					if (founded === 2) break;
				}
			}
			throw this.input.error("Missed semicolon", token[0] === "word" ? token[3] + 1 : token[2]);
		}
		colon(tokens) {
			let brackets = 0;
			let prev, token, type;
			for (let [i, element] of tokens.entries()) {
				token = element;
				type = token[0];
				if (type === "(") brackets += 1;
				if (type === ")") brackets -= 1;
				if (brackets === 0 && type === ":") {
					if (!prev) this.doubleColon(token);
					else if (prev[0] === "word" && prev[1] === "progid") continue;
					else return i;
				}
				prev = token;
			}
			return false;
		}
		comment(token) {
			let node = new Comment();
			this.init(node, token[2]);
			node.source.end = this.getPosition(token[3] || token[2]);
			node.source.end.offset++;
			let text = token[1].slice(2, -2);
			if (!text.trim()) {
				node.text = "";
				node.raws.left = text;
				node.raws.right = "";
			} else {
				let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
				node.text = match[2];
				node.raws.left = match[1];
				node.raws.right = match[3];
			}
		}
		createTokenizer() {
			this.tokenizer = tokenizer(this.input);
		}
		decl(tokens, customProperty) {
			let node = new Declaration();
			this.init(node, tokens[0][2]);
			let last = tokens[tokens.length - 1];
			if (last[0] === ";") {
				this.semicolon = true;
				tokens.pop();
			}
			node.source.end = this.getPosition(last[3] || last[2] || findLastWithPosition(tokens));
			node.source.end.offset++;
			let start = 0;
			while (tokens[start][0] !== "word") {
				if (start === tokens.length - 1) this.unknownWord([tokens[start]]);
				start++;
			}
			node.raws.before += tokensToString(tokens, 0, start);
			node.source.start = this.getPosition(tokens[start][2]);
			let propStart = start;
			while (start < tokens.length) {
				let type = tokens[start][0];
				if (type === ":" || type === "space" || type === "comment") break;
				start++;
			}
			node.prop = tokensToString(tokens, propStart, start);
			let betweenStart = start;
			let token;
			while (start < tokens.length) {
				token = tokens[start];
				start++;
				if (token[0] === ":") break;
				if (token[0] === "word" && /\w/.test(token[1])) this.unknownWord([token]);
			}
			node.raws.between = tokensToString(tokens, betweenStart, start);
			if (node.prop[0] === "_" || node.prop[0] === "*") {
				node.raws.before += node.prop[0];
				node.prop = node.prop.slice(1);
			}
			let firstSpacesStart = start;
			while (start < tokens.length) {
				let next = tokens[start][0];
				if (next !== "space" && next !== "comment") break;
				start++;
			}
			let firstSpaces = tokens.slice(firstSpacesStart, start);
			tokens = tokens.slice(start);
			this.precheckMissedSemicolon(tokens);
			for (let i = tokens.length - 1; i >= 0; i--) {
				token = tokens[i];
				if (token[1].toLowerCase() === "!important") {
					node.important = true;
					let string = this.stringFrom(tokens, i);
					string = this.spacesFromEnd(tokens) + string;
					if (string !== " !important") node.raws.important = string;
					break;
				} else if (token[1].toLowerCase() === "important") {
					let cache = tokens.slice(0);
					let str = "";
					for (let j = i; j > 0; j--) {
						let type = cache[j][0];
						if (str.trim().startsWith("!") && type !== "space") break;
						str = cache.pop()[1] + str;
					}
					if (str.trim().startsWith("!")) {
						node.important = true;
						node.raws.important = str;
						tokens = cache;
					}
				}
				if (token[0] !== "space" && token[0] !== "comment") break;
			}
			if (tokens.some((i) => i[0] !== "space" && i[0] !== "comment")) {
				node.raws.between += firstSpaces.map((i) => i[1]).join("");
				firstSpaces = [];
			}
			this.raw(node, "value", firstSpaces.concat(tokens), customProperty);
			if (node.value.includes(":") && !customProperty) this.checkMissedSemicolon(tokens);
		}
		doubleColon(token) {
			throw this.input.error("Double colon", { offset: token[2] }, { offset: token[2] + token[1].length });
		}
		emptyRule(token) {
			let node = new Rule();
			this.init(node, token[2]);
			node.selector = "";
			node.raws.between = "";
			this.current = node;
		}
		end(token) {
			if (this.current.nodes && this.current.nodes.length) this.current.raws.semicolon = this.semicolon;
			this.semicolon = false;
			this.current.raws.after = (this.current.raws.after || "") + this.spaces;
			this.spaces = "";
			if (this.current.parent) {
				this.current.source.end = this.getPosition(token[2]);
				this.current.source.end.offset++;
				this.current = this.current.parent;
			} else this.unexpectedClose(token);
		}
		endFile() {
			if (this.current.parent) this.unclosedBlock();
			if (this.current.nodes && this.current.nodes.length) this.current.raws.semicolon = this.semicolon;
			this.current.raws.after = (this.current.raws.after || "") + this.spaces;
			this.root.source.end = this.getPosition(this.tokenizer.position());
		}
		freeSemicolon(token) {
			this.spaces += token[1];
			if (this.current.nodes) {
				let prev = this.current.nodes[this.current.nodes.length - 1];
				if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
					prev.raws.ownSemicolon = this.spaces;
					this.spaces = "";
					prev.source.end = this.getPosition(token[2]);
					prev.source.end.offset++;
				}
			}
		}
		getPosition(offset) {
			let pos = this.input.fromOffset(offset);
			return {
				column: pos.col,
				line: pos.line,
				offset
			};
		}
		init(node, offset) {
			this.current.push(node);
			node.source = {
				input: this.input,
				start: this.getPosition(offset)
			};
			node.raws.before = this.spaces;
			this.spaces = "";
			if (node.type !== "comment") this.semicolon = false;
		}
		other(start) {
			let end = false;
			let type = null;
			let colon = false;
			let bracket = null;
			let brackets = [];
			let customProperty = start[1].startsWith("--");
			let tokens = [];
			let token = start;
			while (token) {
				type = token[0];
				tokens.push(token);
				if (type === "(" || type === "[") {
					if (!bracket) bracket = token;
					brackets.push(type === "(" ? ")" : "]");
				} else if (customProperty && colon && type === "{") {
					if (!bracket) bracket = token;
					brackets.push("}");
				} else if (brackets.length === 0) {
					if (type === ";") {
						if (colon) {
							this.decl(tokens, customProperty);
							return;
						} else break;
					} else if (type === "{") {
						this.rule(tokens);
						return;
					} else if (type === "}") {
						this.tokenizer.back(tokens.pop());
						end = true;
						break;
					} else if (type === ":") colon = true;
				} else if (type === brackets[brackets.length - 1]) {
					brackets.pop();
					if (brackets.length === 0) bracket = null;
				}
				token = this.tokenizer.nextToken();
			}
			if (this.tokenizer.endOfFile()) end = true;
			if (brackets.length > 0) this.unclosedBracket(bracket);
			if (end && colon) {
				if (!customProperty) while (tokens.length) {
					token = tokens[tokens.length - 1][0];
					if (token !== "space" && token !== "comment") break;
					this.tokenizer.back(tokens.pop());
				}
				this.decl(tokens, customProperty);
			} else this.unknownWord(tokens);
		}
		parse() {
			let token;
			while (!this.tokenizer.endOfFile()) {
				token = this.tokenizer.nextToken();
				switch (token[0]) {
					case "space":
						this.spaces += token[1];
						break;
					case ";":
						this.freeSemicolon(token);
						break;
					case "}":
						this.end(token);
						break;
					case "comment":
						this.comment(token);
						break;
					case "at-word":
						this.atrule(token);
						break;
					case "{":
						this.emptyRule(token);
						break;
					default: this.other(token);
				}
			}
			this.endFile();
		}
		precheckMissedSemicolon() {}
		raw(node, prop, tokens, customProperty) {
			let token, type;
			let length = tokens.length;
			let value = "";
			let clean = true;
			let next, prev;
			for (let i = 0; i < length; i += 1) {
				token = tokens[i];
				type = token[0];
				if (type === "space" && i === length - 1 && !customProperty) clean = false;
				else if (type === "comment") {
					prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
					next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
					if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
						if (value.slice(-1) === ",") clean = false;
						else value += token[1];
					} else clean = false;
				} else value += token[1];
			}
			if (!clean) {
				let raw = tokens.reduce((all, i) => all + i[1], "");
				node.raws[prop] = {
					raw,
					value
				};
			}
			node[prop] = value;
		}
		rule(tokens) {
			tokens.pop();
			let node = new Rule();
			this.init(node, tokens[0][2]);
			node.raws.between = this.spacesAndCommentsFromEnd(tokens);
			this.raw(node, "selector", tokens);
			this.current = node;
		}
		spacesAndCommentsFromEnd(tokens) {
			let lastTokenType;
			let spaces = "";
			while (tokens.length) {
				lastTokenType = tokens[tokens.length - 1][0];
				if (lastTokenType !== "space" && lastTokenType !== "comment") break;
				spaces = tokens.pop()[1] + spaces;
			}
			return spaces;
		}
		spacesAndCommentsFromStart(tokens) {
			let next;
			let spaces = "";
			while (tokens.length) {
				next = tokens[0][0];
				if (next !== "space" && next !== "comment") break;
				spaces += tokens.shift()[1];
			}
			return spaces;
		}
		spacesFromEnd(tokens) {
			let lastTokenType;
			let spaces = "";
			while (tokens.length) {
				lastTokenType = tokens[tokens.length - 1][0];
				if (lastTokenType !== "space") break;
				spaces = tokens.pop()[1] + spaces;
			}
			return spaces;
		}
		stringFrom(tokens, from) {
			let result = "";
			for (let i = from; i < tokens.length; i++) result += tokens[i][1];
			tokens.splice(from, tokens.length - from);
			return result;
		}
		unclosedBlock() {
			let pos = this.current.source.start;
			throw this.input.error("Unclosed block", pos.line, pos.column);
		}
		unclosedBracket(bracket) {
			throw this.input.error("Unclosed bracket", { offset: bracket[2] }, { offset: bracket[2] + 1 });
		}
		unexpectedClose(token) {
			throw this.input.error("Unexpected }", { offset: token[2] }, { offset: token[2] + 1 });
		}
		unknownWord(tokens) {
			throw this.input.error("Unknown word " + tokens[0][1], { offset: tokens[0][2] }, { offset: tokens[0][2] + tokens[0][1].length });
		}
		unnamedAtrule(node, token) {
			throw this.input.error("At-rule without name", { offset: token[2] }, { offset: token[2] + token[1].length });
		}
	};
	module.exports = Parser;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let Input = require_input();
	let Parser = require_parser();
	function parse(css, opts) {
		let input = new Input(css, opts);
		let parser = new Parser(input);
		try {
			parser.parse();
		} catch (e) {
			if (process.env.NODE_ENV !== "production") {
				if (e.name === "CssSyntaxError" && opts && opts.from) {
					if (/\.scss$/i.test(opts.from)) e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
					else if (/\.sass/i.test(opts.from)) e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
					else if (/\.less$/i.test(opts.from)) e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
				}
			}
			throw e;
		}
		return parser.root;
	}
	module.exports = parse;
	parse.default = parse;
	Container.registerParse(parse);
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/warning.js
var require_warning = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let { my } = require_symbols();
	var Warning = class {
		constructor(text, opts = {}) {
			this.type = "warning";
			this.text = text;
			if (opts.node && opts.node.source) {
				if (!opts.node[my]) Container.rebuild(opts.node);
				let range = opts.node.rangeBy(opts);
				this.line = range.start.line;
				this.column = range.start.column;
				this.endLine = range.end.line;
				this.endColumn = range.end.column;
			}
			for (let opt in opts) this[opt] = opts[opt];
		}
		toString() {
			if (this.node) return this.node.error(this.text, {
				index: this.index,
				plugin: this.plugin,
				word: this.word
			}).message;
			if (this.plugin) return this.plugin + ": " + this.text;
			return this.text;
		}
	};
	module.exports = Warning;
	Warning.default = Warning;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/result.js
var require_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Warning = require_warning();
	var Result = class {
		get content() {
			return this.css;
		}
		constructor(processor, root, opts) {
			this.processor = processor;
			this.messages = [];
			this.root = root;
			this.opts = opts;
			this.css = "";
			this.map = void 0;
		}
		toString() {
			return this.css;
		}
		warn(text, opts = {}) {
			if (!opts.plugin) {
				if (this.lastPlugin && this.lastPlugin.postcssPlugin) opts.plugin = this.lastPlugin.postcssPlugin;
			}
			let warning = new Warning(text, opts);
			this.messages.push(warning);
			return warning;
		}
		warnings() {
			return this.messages.filter((i) => i.type === "warning");
		}
	};
	module.exports = Result;
	Result.default = Result;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/warn-once.js
var require_warn_once = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let printed = {};
	module.exports = function warnOnce(message) {
		if (printed[message]) return;
		printed[message] = true;
		if (typeof console !== "undefined" && console.warn) console.warn(message);
	};
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/lazy-result.js
var require_lazy_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Container = require_container();
	let Document = require_document();
	let MapGenerator = require_map_generator();
	let parse = require_parse();
	let Result = require_result();
	let Root = require_root();
	let stringify = require_stringify();
	let { isClean, my } = require_symbols();
	let warnOnce = require_warn_once();
	const TYPE_TO_CLASS_NAME = {
		atrule: "AtRule",
		comment: "Comment",
		decl: "Declaration",
		document: "Document",
		root: "Root",
		rule: "Rule"
	};
	const PLUGIN_PROPS = {
		AtRule: true,
		AtRuleExit: true,
		Comment: true,
		CommentExit: true,
		Declaration: true,
		DeclarationExit: true,
		Document: true,
		DocumentExit: true,
		Once: true,
		OnceExit: true,
		postcssPlugin: true,
		prepare: true,
		Root: true,
		RootExit: true,
		Rule: true,
		RuleExit: true
	};
	const NOT_VISITORS = {
		Once: true,
		postcssPlugin: true,
		prepare: true
	};
	const CHILDREN = 0;
	function isPromise(obj) {
		return typeof obj === "object" && typeof obj.then === "function";
	}
	function getEvents(node) {
		let key = false;
		let type = TYPE_TO_CLASS_NAME[node.type];
		if (node.type === "decl") key = node.prop.toLowerCase();
		else if (node.type === "atrule") key = node.name.toLowerCase();
		if (key && node.append) return [
			type,
			type + "-" + key,
			CHILDREN,
			type + "Exit",
			type + "Exit-" + key
		];
		else if (key) return [
			type,
			type + "-" + key,
			type + "Exit",
			type + "Exit-" + key
		];
		else if (node.append) return [
			type,
			CHILDREN,
			type + "Exit"
		];
		else return [type, type + "Exit"];
	}
	function toStack(node) {
		let events;
		if (node.type === "document") events = [
			"Document",
			CHILDREN,
			"DocumentExit"
		];
		else if (node.type === "root") events = [
			"Root",
			CHILDREN,
			"RootExit"
		];
		else events = getEvents(node);
		return {
			eventIndex: 0,
			events,
			iterator: 0,
			node,
			visitorIndex: 0,
			visitors: []
		};
	}
	function cleanMarks(node) {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			next[isClean] = false;
			if (next.nodes) for (let i of next.nodes) stack.push(i);
		}
		return node;
	}
	let postcss = {};
	var LazyResult = class LazyResult {
		get content() {
			return this.stringify().content;
		}
		get css() {
			return this.stringify().css;
		}
		get map() {
			return this.stringify().map;
		}
		get messages() {
			return this.sync().messages;
		}
		get opts() {
			return this.result.opts;
		}
		get processor() {
			return this.result.processor;
		}
		get root() {
			return this.sync().root;
		}
		get [Symbol.toStringTag]() {
			return "LazyResult";
		}
		constructor(processor, css, opts) {
			this.stringified = false;
			this.processed = false;
			let root;
			if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) root = cleanMarks(css);
			else if (css instanceof LazyResult || css instanceof Result) {
				root = cleanMarks(css.root);
				if (css.map) {
					if (typeof opts.map === "undefined") opts.map = {};
					if (!opts.map.inline) opts.map.inline = false;
					opts.map.prev = css.map;
				}
			} else {
				let parser = parse;
				if (opts.syntax) parser = opts.syntax.parse;
				if (opts.parser) parser = opts.parser;
				if (parser.parse) parser = parser.parse;
				try {
					root = parser(css, opts);
				} catch (error) {
					this.processed = true;
					this.error = error;
				}
				if (root && !root[my])
 /* c8 ignore next 2 */
				Container.rebuild(root);
			}
			this.result = new Result(processor, root, opts);
			this.helpers = {
				...postcss,
				postcss,
				result: this.result
			};
			this.plugins = this.processor.plugins.map((plugin) => {
				if (typeof plugin === "object" && plugin.prepare) return {
					...plugin,
					...plugin.prepare(this.result)
				};
				else return plugin;
			});
		}
		async() {
			if (this.error) return Promise.reject(this.error);
			if (this.processed) return Promise.resolve(this.result);
			if (!this.processing) this.processing = this.runAsync();
			return this.processing;
		}
		catch(onRejected) {
			return this.async().catch(onRejected);
		}
		finally(onFinally) {
			return this.async().then(onFinally, onFinally);
		}
		getAsyncError() {
			throw new Error("Use process(css).then(cb) to work with async plugins");
		}
		handleError(error, node) {
			let plugin = this.result.lastPlugin;
			try {
				if (node) node.addToError(error);
				this.error = error;
				if (error.name === "CssSyntaxError" && !error.plugin) {
					error.plugin = plugin.postcssPlugin;
					error.setMessage();
				} else if (plugin.postcssVersion) {
					if (process.env.NODE_ENV !== "production") {
						let pluginName = plugin.postcssPlugin;
						let pluginVer = plugin.postcssVersion;
						let runtimeVer = this.result.processor.version;
						let a = pluginVer.split(".");
						let b = runtimeVer.split(".");
						if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) console.error("Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below.");
					}
				}
			} catch (err) {
				/* c8 ignore next 3 */
				if (console && console.error) console.error(err);
			}
			return error;
		}
		prepareVisitors() {
			this.listeners = {};
			let add = (plugin, type, cb) => {
				if (!this.listeners[type]) this.listeners[type] = [];
				this.listeners[type].push([plugin, cb]);
			};
			for (let plugin of this.plugins) if (typeof plugin === "object") for (let event in plugin) {
				if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) throw new Error(`Unknown event ${event} in ${plugin.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`);
				if (!NOT_VISITORS[event]) {
					if (typeof plugin[event] === "object") for (let filter in plugin[event]) if (filter === "*") add(plugin, event, plugin[event][filter]);
					else add(plugin, event + "-" + filter.toLowerCase(), plugin[event][filter]);
					else if (typeof plugin[event] === "function") add(plugin, event, plugin[event]);
				}
			}
			this.hasListener = Object.keys(this.listeners).length > 0;
		}
		async runAsync() {
			this.plugin = 0;
			for (let i = 0; i < this.plugins.length; i++) {
				let plugin = this.plugins[i];
				let promise = this.runOnRoot(plugin);
				if (isPromise(promise)) try {
					await promise;
				} catch (error) {
					throw this.handleError(error);
				}
			}
			this.prepareVisitors();
			if (this.hasListener) {
				let root = this.result.root;
				while (!root[isClean]) {
					root[isClean] = true;
					let stack = [toStack(root)];
					while (stack.length > 0) {
						let promise = this.visitTick(stack);
						if (isPromise(promise)) try {
							await promise;
						} catch (e) {
							let node = stack[stack.length - 1].node;
							throw this.handleError(e, node);
						}
					}
				}
				if (this.listeners.OnceExit) for (let [plugin, visitor] of this.listeners.OnceExit) {
					this.result.lastPlugin = plugin;
					try {
						if (root.type === "document") {
							let roots = root.nodes.map((subRoot) => visitor(subRoot, this.helpers));
							await Promise.all(roots);
						} else await visitor(root, this.helpers);
					} catch (e) {
						throw this.handleError(e);
					}
				}
			}
			this.processed = true;
			return this.stringify();
		}
		runOnRoot(plugin) {
			this.result.lastPlugin = plugin;
			try {
				if (typeof plugin === "object" && plugin.Once) {
					if (this.result.root.type === "document") {
						let roots = this.result.root.nodes.map((root) => plugin.Once(root, this.helpers));
						if (isPromise(roots[0])) return Promise.all(roots);
						return roots;
					}
					return plugin.Once(this.result.root, this.helpers);
				} else if (typeof plugin === "function") return plugin(this.result.root, this.result);
			} catch (error) {
				throw this.handleError(error);
			}
		}
		stringify() {
			if (this.error) throw this.error;
			if (this.stringified) return this.result;
			this.stringified = true;
			this.sync();
			let opts = this.result.opts;
			let str = stringify;
			if (opts.syntax) str = opts.syntax.stringify;
			if (opts.stringifier) str = opts.stringifier;
			if (str.stringify) str = str.stringify;
			let rootSource = this.result.root.source;
			if (opts.map === void 0 && !(rootSource && rootSource.input && rootSource.input.map)) {
				let result = "";
				str(this.result.root, (i) => {
					result += i;
				});
				this.result.css = result;
				return this.result;
			}
			let data = new MapGenerator(str, this.result.root, this.result.opts).generate();
			this.result.css = data[0];
			this.result.map = data[1];
			return this.result;
		}
		sync() {
			if (this.error) throw this.error;
			if (this.processed) return this.result;
			this.processed = true;
			if (this.processing) throw this.getAsyncError();
			for (let plugin of this.plugins) if (isPromise(this.runOnRoot(plugin))) throw this.getAsyncError();
			this.prepareVisitors();
			if (this.hasListener) {
				let root = this.result.root;
				while (!root[isClean]) {
					root[isClean] = true;
					this.walkSync(root);
				}
				if (this.listeners.OnceExit) {
					if (root.type === "document") for (let subRoot of root.nodes) this.visitSync(this.listeners.OnceExit, subRoot);
					else this.visitSync(this.listeners.OnceExit, root);
				}
			}
			return this.result;
		}
		then(onFulfilled, onRejected) {
			if (process.env.NODE_ENV !== "production") {
				if (!("from" in this.opts)) warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
			}
			return this.async().then(onFulfilled, onRejected);
		}
		toString() {
			return this.css;
		}
		visitSync(visitors, node) {
			for (let [plugin, visitor] of visitors) {
				this.result.lastPlugin = plugin;
				let promise;
				try {
					promise = visitor(node, this.helpers);
				} catch (e) {
					throw this.handleError(e, node.proxyOf);
				}
				if (node.type !== "root" && node.type !== "document" && !node.parent) return true;
				if (isPromise(promise)) throw this.getAsyncError();
			}
		}
		visitTick(stack) {
			let visit = stack[stack.length - 1];
			let { node, visitors } = visit;
			if (node.type !== "root" && node.type !== "document" && !node.parent) {
				stack.pop();
				return;
			}
			if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
				let [plugin, visitor] = visitors[visit.visitorIndex];
				visit.visitorIndex += 1;
				if (visit.visitorIndex === visitors.length) {
					visit.visitors = [];
					visit.visitorIndex = 0;
				}
				this.result.lastPlugin = plugin;
				try {
					return visitor(node.toProxy(), this.helpers);
				} catch (e) {
					throw this.handleError(e, node);
				}
			}
			if (visit.iterator !== 0) {
				let iterator = visit.iterator;
				if (visit.descending) {
					visit.descending = false;
					node.indexes[iterator] += 1;
				}
				let child;
				while (child = node.nodes[node.indexes[iterator]]) {
					if (!child[isClean]) {
						child[isClean] = true;
						visit.descending = true;
						stack.push(toStack(child));
						return;
					}
					node.indexes[iterator] += 1;
				}
				visit.iterator = 0;
				delete node.indexes[iterator];
			}
			let events = visit.events;
			while (visit.eventIndex < events.length) {
				let event = events[visit.eventIndex];
				visit.eventIndex += 1;
				if (event === CHILDREN) {
					if (node.nodes && node.nodes.length) {
						node[isClean] = true;
						visit.iterator = node.getIterator();
					}
					return;
				} else if (this.listeners[event]) {
					visit.visitors = this.listeners[event];
					return;
				}
			}
			stack.pop();
		}
		walkSync(node) {
			node[isClean] = true;
			let stack = [{
				eventIndex: 0,
				events: getEvents(node),
				iterator: 0,
				node
			}];
			while (stack.length > 0) {
				let visit = stack[stack.length - 1];
				let visitNode = visit.node;
				if (visit.iterator !== 0) {
					let iterator = visit.iterator;
					if (visit.descending) {
						visit.descending = false;
						visitNode.indexes[iterator] += 1;
					}
					let child;
					let descended = false;
					while (child = visitNode.nodes[visitNode.indexes[iterator]]) {
						if (!child[isClean]) {
							child[isClean] = true;
							visit.descending = true;
							stack.push({
								eventIndex: 0,
								events: getEvents(child),
								iterator: 0,
								node: child
							});
							descended = true;
							break;
						}
						visitNode.indexes[iterator] += 1;
					}
					if (descended) continue;
					visit.iterator = 0;
					delete visitNode.indexes[iterator];
				}
				if (visit.eventIndex < visit.events.length) {
					let event = visit.events[visit.eventIndex];
					visit.eventIndex += 1;
					if (event === CHILDREN) {
						if (visitNode.nodes && visitNode.nodes.length) visit.iterator = visitNode.getIterator();
					} else {
						let visitors = this.listeners[event];
						if (visitors) {
							if (this.visitSync(visitors, visitNode.toProxy())) stack.pop();
						}
					}
					continue;
				}
				stack.pop();
			}
		}
		warnings() {
			return this.sync().warnings();
		}
	};
	LazyResult.registerPostcss = (dependant) => {
		postcss = dependant;
	};
	module.exports = LazyResult;
	LazyResult.default = LazyResult;
	Root.registerLazyResult(LazyResult);
	Document.registerLazyResult(LazyResult);
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/no-work-result.js
var require_no_work_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let MapGenerator = require_map_generator();
	let parse = require_parse();
	let Result = require_result();
	let stringify = require_stringify();
	let warnOnce = require_warn_once();
	var NoWorkResult = class {
		get content() {
			return this.result.css;
		}
		get css() {
			return this.result.css;
		}
		get map() {
			return this.result.map;
		}
		get messages() {
			return [];
		}
		get opts() {
			return this.result.opts;
		}
		get processor() {
			return this.result.processor;
		}
		get root() {
			if (this._root) return this._root;
			let root;
			let parser = parse;
			try {
				root = parser(this._css, this._opts);
			} catch (error) {
				this.error = error;
			}
			if (this.error) throw this.error;
			else {
				this._root = root;
				return root;
			}
		}
		get [Symbol.toStringTag]() {
			return "NoWorkResult";
		}
		constructor(processor, css, opts) {
			css = css.toString();
			this.stringified = false;
			this._processor = processor;
			this._css = css;
			this._opts = opts;
			this._map = void 0;
			let str = stringify;
			this.result = new Result(this._processor, void 0, this._opts);
			this.result.css = css;
			let self = this;
			Object.defineProperty(this.result, "root", { get() {
				return self.root;
			} });
			let map = new MapGenerator(str, void 0, this._opts, css);
			if (map.isMap()) {
				let [generatedCSS, generatedMap] = map.generate();
				if (generatedCSS) this.result.css = generatedCSS;
				if (generatedMap) this.result.map = generatedMap;
			} else {
				map.clearAnnotation();
				this.result.css = map.css;
			}
		}
		async() {
			if (this.error) return Promise.reject(this.error);
			return Promise.resolve(this.result);
		}
		catch(onRejected) {
			return this.async().catch(onRejected);
		}
		finally(onFinally) {
			return this.async().then(onFinally, onFinally);
		}
		sync() {
			if (this.error) throw this.error;
			return this.result;
		}
		then(onFulfilled, onRejected) {
			if (process.env.NODE_ENV !== "production") {
				if (!("from" in this._opts)) warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
			}
			return this.async().then(onFulfilled, onRejected);
		}
		toString() {
			return this._css;
		}
		warnings() {
			return [];
		}
	};
	module.exports = NoWorkResult;
	NoWorkResult.default = NoWorkResult;
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/processor.js
var require_processor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let Document = require_document();
	let LazyResult = require_lazy_result();
	let NoWorkResult = require_no_work_result();
	let Root = require_root();
	var Processor = class {
		constructor(plugins = []) {
			this.version = "8.5.28";
			this.plugins = this.normalize(plugins);
		}
		normalize(plugins) {
			let normalized = [];
			for (let i of plugins) {
				if (i.postcss === true) i = i();
				else if (i.postcss) i = i.postcss;
				if (typeof i === "object" && Array.isArray(i.plugins)) normalized = normalized.concat(i.plugins);
				else if (typeof i === "object" && i.postcssPlugin) normalized.push(i);
				else if (typeof i === "function") normalized.push(i);
				else if (typeof i === "object" && (i.parse || i.stringify)) {
					if (process.env.NODE_ENV !== "production") throw new Error("PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation.");
				} else throw new Error(i + " is not a PostCSS plugin");
			}
			return normalized;
		}
		process(css, opts = {}) {
			if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) return new NoWorkResult(this, css, opts);
			else return new LazyResult(this, css, opts);
		}
		use(plugin) {
			this.plugins = this.plugins.concat(this.normalize([plugin]));
			return this;
		}
	};
	module.exports = Processor;
	Processor.default = Processor;
	Root.registerProcessor(Processor);
	Document.registerProcessor(Processor);
}));
//#endregion
//#region ../dsgraph-adapters/node_modules/postcss/lib/postcss.mjs
var import_postcss = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	let AtRule = require_at_rule();
	let Comment = require_comment();
	let Container = require_container();
	let CssSyntaxError = require_css_syntax_error();
	let Declaration = require_declaration();
	let Document = require_document();
	let fromJSON = require_fromJSON();
	let Input = require_input();
	let LazyResult = require_lazy_result();
	let list = require_list();
	let Node = require_node();
	let parse = require_parse();
	let Processor = require_processor();
	let Result = require_result();
	let Root = require_root();
	let Rule = require_rule();
	let stringify = require_stringify();
	let Warning = require_warning();
	function postcss(...plugins) {
		if (plugins.length === 1 && Array.isArray(plugins[0])) plugins = plugins[0];
		return new Processor(plugins);
	}
	postcss.plugin = function plugin(name, initializer) {
		let warningPrinted = false;
		function creator(...args) {
			if (console && console.warn && !warningPrinted) {
				warningPrinted = true;
				console.warn(name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration");
				if (process.env.LANG && process.env.LANG.startsWith("zh"))
 /* c8 ignore next 7 */
				console.warn(name + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226");
			}
			let transformer = initializer(...args);
			transformer.postcssPlugin = name;
			transformer.postcssVersion = new Processor().version;
			return transformer;
		}
		let cache;
		Object.defineProperty(creator, "postcss", { get() {
			if (!cache) cache = creator();
			return cache;
		} });
		creator.process = function(css, processOpts, pluginOpts) {
			return postcss([creator(pluginOpts)]).process(css, processOpts);
		};
		return creator;
	};
	postcss.stringify = stringify;
	postcss.parse = parse;
	postcss.fromJSON = fromJSON;
	postcss.list = list;
	postcss.comment = (defaults) => new Comment(defaults);
	postcss.atRule = (defaults) => new AtRule(defaults);
	postcss.decl = (defaults) => new Declaration(defaults);
	postcss.rule = (defaults) => new Rule(defaults);
	postcss.root = (defaults) => new Root(defaults);
	postcss.document = (defaults) => new Document(defaults);
	postcss.CssSyntaxError = CssSyntaxError;
	postcss.Declaration = Declaration;
	postcss.Container = Container;
	postcss.Processor = Processor;
	postcss.Document = Document;
	postcss.Comment = Comment;
	postcss.Warning = Warning;
	postcss.AtRule = AtRule;
	postcss.Result = Result;
	postcss.Input = Input;
	postcss.Rule = Rule;
	postcss.Root = Root;
	postcss.Node = Node;
	LazyResult.registerPostcss(postcss);
	module.exports = postcss;
	postcss.default = postcss;
})))(), 1);
var postcss_default = import_postcss.default;
import_postcss.default.stringify;
import_postcss.default.fromJSON;
import_postcss.default.plugin;
import_postcss.default.parse;
import_postcss.default.list;
import_postcss.default.document;
import_postcss.default.comment;
import_postcss.default.atRule;
import_postcss.default.rule;
import_postcss.default.decl;
import_postcss.default.root;
import_postcss.default.CssSyntaxError;
import_postcss.default.Declaration;
import_postcss.default.Container;
import_postcss.default.Processor;
import_postcss.default.Document;
import_postcss.default.Comment;
import_postcss.default.Warning;
import_postcss.default.AtRule;
import_postcss.default.Result;
import_postcss.default.Input;
import_postcss.default.Rule;
import_postcss.default.Root;
import_postcss.default.Node;
//#endregion
//#region ../dsgraph-adapters/dist/css-values.js
/** Splits at top-level separators, ignoring those inside parentheses and quotes. */
function splitTopLevel(input, sep) {
	const out = [];
	let depth = 0;
	let quote = "";
	let cur = "";
	for (const ch of input) {
		if (quote) {
			cur += ch;
			if (ch === quote) quote = "";
			continue;
		}
		if (ch === "\"" || ch === "'") quote = ch;
		else if (ch === "(") depth++;
		else if (ch === ")") depth--;
		if ((sep === " " ? /\s/.test(ch) : ch === sep) && depth === 0) {
			if (cur.trim() !== "") out.push(cur.trim());
			cur = "";
		} else cur += ch;
	}
	if (cur.trim() !== "") out.push(cur.trim());
	return out;
}
/** `var(--name)` or `var(--name, fallback)` spanning the whole value. */
function parseVar(value) {
	const v = value.trim();
	if (!v.startsWith("var(") || !v.endsWith(")")) return void 0;
	let depth = 0;
	for (let i = 3; i < v.length; i++) if (v[i] === "(") depth++;
	else if (v[i] === ")") {
		depth--;
		if (depth === 0 && i !== v.length - 1) return void 0;
	}
	const [name, ...rest] = splitTopLevel(v.slice(4, -1), ",");
	if (!name || !/^--[\w\\.-]+$/.test(name.trim())) return void 0;
	const result = { name: name.trim() };
	if (rest.length > 0) result.fallback = rest.join(", ");
	return result;
}
/** Token id for a custom property name: drops the leading `--`; dots (only possible escaped) become `_`. */
const idFromCustomProperty = (prop) => prop.replace(/^--/, "").replace(/\\?\./g, "_");
const LENGTH = /^(-?(?:\d+\.?\d*|\.\d+))(px|rem|em|%|vw|vh|vmin|vmax|ch|ex|pt|cqw|cqh|cqi|dvh|svh|lvh|lh|rlh)$/i;
const NUMBER = /^-?(?:\d+\.?\d*|\.\d+)$/;
const DURATION = /^(-?(?:\d+\.?\d*|\.\d+))(ms|s)$/;
const EASINGS = {
	ease: [
		.25,
		.1,
		.25,
		1
	],
	"ease-in": [
		.42,
		0,
		1,
		1
	],
	"ease-out": [
		0,
		0,
		.58,
		1
	],
	"ease-in-out": [
		.42,
		0,
		.58,
		1
	],
	linear: [
		0,
		0,
		1,
		1
	]
};
const FONT_WEIGHT_WORDS = /* @__PURE__ */ new Set([
	"normal",
	"bold",
	"light",
	"medium",
	"thin",
	"black",
	"regular",
	"semi-bold",
	"extra-bold"
]);
const GENERIC_FAMILIES = /* @__PURE__ */ new Set([
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui",
	"ui-sans-serif",
	"ui-serif",
	"ui-monospace",
	"ui-rounded",
	"emoji",
	"math"
]);
const NON_COLORS = /* @__PURE__ */ new Set([
	"inherit",
	"initial",
	"unset",
	"revert",
	"currentcolor",
	"none"
]);
const hint = (name, words) => words.test(name.toLowerCase());
const isDimensionName = (n) => hint(n, /(space|spacing|size|radius|width|height|gap|inset|offset|gutter|padding|margin|indent|blur|spread|border-w)/);
/** A sub-value inside a composite: a reference, a color or a length. */
function subValue(part, expect) {
	const v = parseVar(part);
	if (v) return `{${idFromCustomProperty(v.name)}}`;
	if (expect === "color") return cssColorToDtcg(part);
	const m = LENGTH.exec(part);
	if (m) return {
		value: Number(m[1]),
		unit: m[2].toLowerCase()
	};
	if (part === "0") return {
		value: 0,
		unit: "px"
	};
}
function parseShadow(value) {
	const layers = [];
	for (const layer of splitTopLevel(value, ",")) {
		const parts = splitTopLevel(layer, " ");
		let inset = false;
		let color;
		const lengths = [];
		for (const p of parts) if (p.toLowerCase() === "inset") inset = true;
		else {
			const len = subValue(p, "dimension");
			if (len !== void 0 && (typeof len !== "string" || lengths.length < 2)) lengths.push(len);
			else {
				const c = subValue(p, "color");
				if (c === void 0 || color !== void 0) return void 0;
				color = c;
			}
		}
		if (lengths.length < 2 || lengths.length > 4 || color === void 0) return void 0;
		const zero = {
			value: 0,
			unit: "px"
		};
		layers.push({
			color,
			offsetX: lengths[0],
			offsetY: lengths[1],
			blur: lengths[2] ?? zero,
			spread: lengths[3] ?? zero,
			inset
		});
	}
	return layers.length > 0 ? layers : void 0;
}
/**
* Infers a DTCG type for a custom property value. Whole `var()` becomes an alias (type comes from
* the target); anything that cannot be represented becomes a `css-expression` that keeps its text.
*/
function cssValueToToken(prop, raw) {
	const value = raw.trim();
	const name = prop.replace(/^--/, "");
	const ref = parseVar(value);
	if (ref) return { $value: `{${idFromCustomProperty(ref.name)}}` };
	const lower = value.toLowerCase();
	if (!NON_COLORS.has(lower)) {
		const color = cssColorToDtcg(value);
		if (color && !NUMBER.test(value)) return {
			$type: "color",
			$value: color
		};
	}
	let m = LENGTH.exec(value);
	if (m) return {
		$type: "dimension",
		$value: {
			value: Number(m[1]),
			unit: m[2].toLowerCase()
		}
	};
	m = DURATION.exec(value);
	if (m) return {
		$type: "duration",
		$value: {
			value: Number(m[1]),
			unit: m[2]
		}
	};
	if (NUMBER.test(value)) {
		const n = Number(value);
		if (hint(name, /weight/) && n >= 1 && n <= 1e3) return {
			$type: "fontWeight",
			$value: n
		};
		if (n === 0 && isDimensionName(name)) return {
			$type: "dimension",
			$value: {
				value: 0,
				unit: "px"
			}
		};
		return {
			$type: "number",
			$value: n
		};
	}
	if (hint(name, /weight/) && FONT_WEIGHT_WORDS.has(lower)) return {
		$type: "fontWeight",
		$value: lower
	};
	const bezier = /^cubic-bezier\(([^)]*)\)$/i.exec(value);
	if (bezier) {
		const nums = bezier[1].split(",").map((s) => Number(s.trim()));
		if (nums.length === 4 && nums.every(Number.isFinite)) return {
			$type: "cubicBezier",
			$value: nums
		};
	}
	if (EASINGS[lower] && hint(name, /(ease|easing|timing|curve|motion)/)) return {
		$type: "cubicBezier",
		$value: EASINGS[lower]
	};
	const families = splitTopLevel(value, ",");
	if (families.length > 1 && families.every((f) => /^(["'][^"']+["']|[\w -]+)$/.test(f)) && families.some((f) => GENERIC_FAMILIES.has(f.toLowerCase()) || /^["']/.test(f)) || hint(name, /(font-family|family|typeface|font-sans|font-serif|font-mono)/) && families.length >= 1 && !value.includes("(")) return {
		$type: "fontFamily",
		$value: families.map((f) => f.replace(/^["']|["']$/g, ""))
	};
	if (hint(name, /shadow|elevation/) || /\d(px|rem)?\s+-?\d/.test(value)) {
		const shadow = parseShadow(value);
		if (shadow) return {
			$type: "shadow",
			$value: shadow
		};
	}
	return {
		$type: "css-expression",
		$value: value
	};
}
//#endregion
//#region ../dsgraph-adapters/dist/css-tokens.js
const ROOT_LIKE = /^(:root|html|:host|body|\*)(:not\([^)]*\))*$/;
const ATTR_THEME = /^(?::root|html|body|:host)?\[(data-[\w-]+)(?:=["']?([\w-]+)["']?)?\](:not\([^)]*\))*$/;
const CLASS_THEME = /^(?::root|html|body|:host)?\.(dark|light|theme-([\w-]+)|([\w-]+)-theme)(:not\([^)]*\))*$/;
const COLOR_SCHEME = /prefers-color-scheme\s*:\s*(dark|light)/i;
/** Several attributes at once: `[data-color-mode="dark"][data-dark-theme="dark_dimmed"]`. */
const COMPOUND_ATTR = /^(?::root|html|body|:host)?((?:\[data-[\w-]+(?:=["']?[\w-]+["']?)?\]){2,})(:not\([^)]*\))*$/;
const norm = (s) => s.replace(/\s+/g, " ").replace(/["']/g, "").trim().toLowerCase();
/** Conditional at-rules around a declaration, outermost first (`@layer` is ignored). */
function atRulesOf(decl) {
	const out = [];
	let node = decl.parent?.parent;
	while (node && node.type !== "root") {
		if (node.type === "atrule") {
			const at = node;
			if (at.name !== "layer") out.unshift(`@${at.name} ${norm(at.params)}`);
		}
		node = node.parent;
	}
	return out;
}
/** Well-known conditions under the names people use for them. */
const KNOWN_CONDITIONS = [
	[/display-p3|color-gamut\s*:\s*p3/, "display-p3"],
	[/color-gamut\s*:\s*rec2020/, "rec2020"],
	[/prefers-reduced-motion\s*:\s*reduce/, "reduced-motion"],
	[/prefers-contrast\s*:\s*more/, "high-contrast"],
	[/prefers-contrast\s*:\s*less/, "low-contrast"],
	[/forced-colors\s*:\s*active/, "forced-colors"]
];
/**
* A short modifier name for an at-rule: `@media (min-width: 768px)` → `min-width: 768px`,
* `@supports (color: color(display-p3 1 1 1))` → `display-p3`.
*/
function conditionName(atRule) {
	for (const [re, name] of KNOWN_CONDITIONS) if (re.test(atRule)) return name;
	const m = /^@(\w+)\s*(.*)$/.exec(atRule.trim());
	if (!m) return atRule;
	const params = m[2].replace(/^\((.*)\)$/, "$1").replace(/\(([^()]*)\)/g, "").replace(/\s+/g, " ").trim();
	return m[1] === "media" ? params : `${m[1]} ${params}`;
}
function autoPlacement(selectors, atRules) {
	const media = atRules.find((a) => !COLOR_SCHEME.test(a));
	const scheme = atRules.map((a) => COLOR_SCHEME.exec(a)?.[1]?.toLowerCase()).find(Boolean);
	for (const raw of selectors) {
		const sel = raw.replace(/\s+/g, "");
		if (ROOT_LIKE.test(sel)) {
			if (media) return {
				kind: "context",
				modifier: conditionName(media),
				context: "on",
				boolean: true
			};
			if (scheme) return {
				kind: "context",
				modifier: "theme",
				context: scheme
			};
			return { kind: "base" };
		}
		const attr = ATTR_THEME.exec(sel);
		if (attr && !media) return {
			kind: "context",
			modifier: attr[1].replace(/^data-/, ""),
			context: attr[2] ?? "on"
		};
		const cls = CLASS_THEME.exec(sel);
		if (cls && !media) return {
			kind: "context",
			modifier: "theme",
			context: cls[2] ?? cls[3] ?? cls[1]
		};
		const compound = COMPOUND_ATTR.exec(sel);
		if (compound && !media) {
			const values = [...compound[1].matchAll(/=["']?([\w-]+)["']?\]/g)].map((m) => m[1]);
			if (values.length) return {
				kind: "context",
				modifier: "theme",
				context: values[values.length - 1]
			};
		}
	}
	return { kind: "skip" };
}
/** Configured placement: `css.contexts` patterns such as `[data-theme=dark]` or `@media (prefers-color-scheme: dark) :root`. */
function configuredPlacement(selectors, atRules, contexts) {
	const sels = selectors.map(norm);
	for (const [modifier, ctxs] of Object.entries(contexts)) for (const [context, patterns] of Object.entries(ctxs)) for (const pattern of patterns) {
		const m = /^(@\w+\s*\([^)]*\))?\s*(.*)$/.exec(pattern.trim());
		const atPart = m[1] ? norm(m[1].replace(/^@(\w+)\s*/, "@$1 ")) : void 0;
		const selPart = m[2] ? norm(m[2]) : void 0;
		const atOk = atPart ? atRules.includes(atPart) : atRules.length === 0;
		const selOk = selPart ? sels.includes(selPart) : sels.some((s) => ROOT_LIKE.test(s.replace(/\s+/g, "")));
		if (atOk && selOk) return {
			kind: "context",
			modifier,
			context
		};
	}
}
/**
* CSS custom properties → token system (spec section 4.3). Root-like rules form the base set;
* theme selectors and `prefers-color-scheme` become a `theme`-style modifier; other media queries
* become independent on/off modifiers. Scoped variables (e.g. `.button { --x }`) are not tokens.
*/
const cssTokens = {
	name: "tokens-css",
	async detect(source, config) {
		const exclude = excludeFor(config, "css");
		const files = (await source.list(config.css?.include ?? ["**/*.css"])).filter((p) => !matchGlob(p, exclude));
		if (config.css?.include) return files;
		await prefetch(source, files);
		const out = [];
		for (const f of files) {
			const text = await source.readText(f);
			if (/--[\w-]+\s*:/.test(text) && /(:root|html|:host|\[data-|prefers-color-scheme|\.(dark|light)\b|\.theme-|-theme\b)/.test(text)) out.push(f);
		}
		return out;
	},
	async load(source, files, config, diag) {
		const configured = config.css?.contexts;
		const base = [];
		const modifiers = /* @__PURE__ */ new Map();
		const orderOfModifiers = [];
		await prefetch(source, files);
		for (const file of [...files].sort()) {
			let root;
			try {
				root = postcss_default.parse(await source.readText(file), { from: file });
			} catch (e) {
				diag.error("css/parse-error", e.message, { file });
				continue;
			}
			const baseTree = {};
			const contextTrees = /* @__PURE__ */ new Map();
			let skipped = 0;
			root.walkDecls((decl) => {
				if (!decl.prop.startsWith("--")) return;
				const rule = decl.parent;
				if (rule?.type !== "rule") {
					skipped++;
					return;
				}
				const selectors = rule.selectors;
				const atRules = atRulesOf(decl);
				const placement = (configured && configuredPlacement(selectors, atRules, configured)) ?? (configured ? selectors.some((s) => ROOT_LIKE.test(s.replace(/\s+/g, ""))) && atRules.length === 0 ? { kind: "base" } : { kind: "skip" } : autoPlacement(selectors, atRules));
				if (placement.kind === "skip") {
					skipped++;
					return;
				}
				const id = idFromCustomProperty(decl.prop);
				const entry = cssValueToToken(decl.prop, decl.value);
				const token = {
					$value: entry.$value,
					$extensions: { "dev.dsgraph": { css: decl.prop } }
				};
				if (entry.$type) {
					token.$type = entry.$type;
					token.$extensions["dev.dsgraph"].typeInferred = true;
				}
				if (placement.kind === "base") baseTree[id] = token;
				else {
					if (!modifiers.has(placement.modifier)) {
						modifiers.set(placement.modifier, {
							contexts: /* @__PURE__ */ new Map(),
							boolean: placement.boolean ?? false
						});
						orderOfModifiers.push(placement.modifier);
					}
					const key = `${placement.modifier}\u0000${placement.context}`;
					const tree = contextTrees.get(key) ?? {};
					tree[id] = token;
					contextTrees.set(key, tree);
				}
			});
			if (skipped > 0) diag.info("css/scoped-variable", `${skipped} custom properties outside root or theme selectors are not tokens`, { file });
			if (Object.keys(baseTree).length > 0) base.push({
				file,
				tree: baseTree
			});
			for (const [key, tree] of contextTrees) {
				const [modifier, context] = key.split("\0");
				const m = modifiers.get(modifier);
				m.contexts.set(context, [...m.contexts.get(context) ?? [], {
					file,
					tree
				}]);
			}
		}
		const system = {
			sets: /* @__PURE__ */ new Map([["base", base]]),
			modifiers: /* @__PURE__ */ new Map(),
			order: [{
				kind: "set",
				name: "base"
			}],
			synthetic: true,
			kind: "css"
		};
		for (const name of orderOfModifiers) {
			const m = modifiers.get(name);
			const contexts = /* @__PURE__ */ new Map();
			let defaultContext;
			if (m.boolean) {
				contexts.set("off", []);
				contexts.set("on", m.contexts.get("on") ?? []);
				defaultContext = "off";
			} else if (configured?.[name]) {
				for (const ctx of Object.keys(configured[name])) contexts.set(ctx, m.contexts.get(ctx) ?? []);
				defaultContext = Object.keys(configured[name])[0];
			} else {
				defaultContext = m.contexts.has("light") ? "light" : "default";
				if (!m.contexts.has(defaultContext)) contexts.set(defaultContext, []);
				for (const [ctx, docs] of m.contexts) contexts.set(ctx, docs);
			}
			system.modifiers.set(name, {
				contexts,
				default: defaultContext
			});
			system.order.push({
				kind: "modifier",
				name
			});
		}
		if (base.length === 0 && modifiers.size === 0) diag.warn("tokens/no-files", "No CSS custom properties found in root or theme selectors");
		return system;
	}
};
//#endregion
//#region ../dsgraph-adapters/dist/json-values.js
/** Types of token-set and value/type JSON → DTCG types. Others keep their own name. */
const TYPES = {
	color: "color",
	dimension: "dimension",
	sizing: "dimension",
	spacing: "dimension",
	size: "dimension",
	borderRadius: "dimension",
	borderWidth: "dimension",
	fontSizes: "dimension",
	fontSize: "dimension",
	letterSpacing: "dimension",
	paragraphSpacing: "dimension",
	paragraphIndent: "dimension",
	opacity: "number",
	number: "number",
	fontFamilies: "fontFamily",
	fontFamily: "fontFamily",
	fontWeights: "fontWeight",
	fontWeight: "fontWeight",
	lineHeights: "lineHeight",
	lineHeight: "lineHeight",
	typography: "typography",
	boxShadow: "shadow",
	shadow: "shadow",
	border: "border",
	duration: "duration",
	time: "duration",
	easing: "cubicBezier",
	cubicBezier: "cubicBezier",
	strokeStyle: "strokeStyle",
	transition: "transition",
	gradient: "gradient"
};
/** `border-radius` (kebab-case types) → `borderRadius`. */
const mapKey = (t) => t.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
const mapType = (t) => TYPES[t] ?? TYPES[mapKey(t)] ?? t;
/** Types only the token-set format uses; their presence tells it from plain value/type JSON. */
const SET_FORMAT_TYPES = /* @__PURE__ */ new Set([
	"sizing",
	"spacing",
	"borderRadius",
	"borderWidth",
	"fontSizes",
	"fontFamilies",
	"fontWeights",
	"lineHeights",
	"letterSpacing",
	"paragraphSpacing",
	"paragraphIndent",
	"boxShadow",
	"composition",
	"textCase",
	"textDecoration",
	"opacity"
]);
const FONT_WEIGHTS = {
	thin: 100,
	hairline: 100,
	extralight: 200,
	ultralight: 200,
	light: 300,
	normal: 400,
	regular: 400,
	book: 400,
	medium: 500,
	semibold: 600,
	demibold: 600,
	bold: 700,
	extrabold: 800,
	ultrabold: 800,
	black: 900,
	heavy: 900,
	extrablack: 950,
	ultrablack: 950
};
const WHOLE_REF = /^\{[^{}]+\}$/;
const NUM = /^\s*(-?(?:\d+\.?\d*|\.\d+))\s*([a-z%]*)\s*$/i;
const isObj$1 = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
/**
* References as these tools write them, in DTCG syntax: `{a.b.value}` and `{a.b.$value}` drop the
* suffix, a whole-value `$a.b` (an early notation) becomes `{a.b}`.
*/
function normalizeRefs(v) {
	if (typeof v === "string") {
		const s = v.replace(/\{([^{}]+?)\.\$?value\}/g, "{$1}");
		return /^\$[\w-]+(\.[\w-]+)+$/.test(s) ? `{${s.slice(1)}}` : s;
	}
	if (Array.isArray(v)) return v.map(normalizeRefs);
	if (isObj$1(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, normalizeRefs(x)]));
	return v;
}
const hasRefInside = (s) => s.includes("{") && !WHOLE_REF.test(s.trim());
const isArithmetic = (s) => /^[\d\s.+\-*/()a-z%]+$/i.test(s) && /\d\s*[-+*/]\s*[\d(.]/.test(s);
/** A string that stays as text for the core: a reference or an expression with references. */
function deferred(s, c) {
	if (WHOLE_REF.test(s.trim())) return s.trim();
	if (hasRefInside(s)) {
		c.expression = true;
		return s;
	}
}
function dimension(v, c, percentAs) {
	if (typeof v === "number") return {
		value: v,
		unit: v === 0 ? "px" : c.unit
	};
	if (typeof v !== "string") return v;
	const d = deferred(v, c);
	if (d !== void 0) return d;
	const m = NUM.exec(v);
	if (m) {
		const n = Number(m[1]);
		const unit = m[2].toLowerCase();
		if (unit === "%" && percentAs === "em") return {
			value: n / 100,
			unit: "em"
		};
		return {
			value: n,
			unit: unit || c.unit
		};
	}
	if (isArithmetic(v) || /^calc\(/i.test(v)) return evaluateExpression(v, "dimension", c.unit) ?? v;
	return v;
}
function numberValue(v, c) {
	if (typeof v !== "string") return v;
	const d = deferred(v, c);
	if (d !== void 0) return d;
	const m = NUM.exec(v);
	if (m && (m[2] === "" || m[2] === "%")) return m[2] === "%" ? Number(m[1]) / 100 : Number(m[1]);
	return evaluateExpression(v, "number") ?? v;
}
function color(v, c) {
	if (typeof v !== "string") return v;
	const d = deferred(v, c);
	if (d !== void 0) return d;
	return cssColorToDtcg(v) ?? evaluateExpression(v, "color") ?? v;
}
function fontFamily(v) {
	if (typeof v !== "string" || WHOLE_REF.test(v.trim())) return v;
	const list = splitTopLevel(v, ",").map((f) => f.replace(/^["']|["']$/g, ""));
	return list.length === 1 ? list[0] : list;
}
/** `Bold`, `Semi Bold Italic`, `700` → a number; unknown names stay as written. */
function fontWeight(v) {
	if (typeof v === "number" || typeof v !== "string" || WHOLE_REF.test(v.trim())) return v;
	if (/^\d+$/.test(v.trim())) return Number(v);
	const key = v.toLowerCase().replace(/\b(italic|oblique|(semi|extra|ultra)?\s*(condensed|compressed|expanded|extended)|narrow|wide)\b/g, "").replace(/[\s_-]/g, "");
	return FONT_WEIGHTS[key === "" ? "regular" : key] ?? v;
}
/** Line height: a percentage or a small unitless number is a multiplier; a larger one is px. */
function lineHeight(v, c) {
	if (typeof v === "number") return v <= 4 ? {
		type: "number",
		value: v
	} : {
		type: "dimension",
		value: {
			value: v,
			unit: c.unit
		}
	};
	if (typeof v !== "string") return {
		type: "number",
		value: v
	};
	if (WHOLE_REF.test(v.trim())) return {
		type: "",
		value: v.trim()
	};
	const d = deferred(v, c);
	if (d !== void 0) return {
		type: "dimension",
		value: d
	};
	if (/^auto$/i.test(v.trim())) return void 0;
	const m = NUM.exec(v);
	if (!m) return {
		type: "number",
		value: evaluateExpression(v, "number") ?? v
	};
	const n = Number(m[1]);
	const unit = m[2].toLowerCase();
	if (unit === "%") return {
		type: "number",
		value: n / 100
	};
	if (unit === "" && n <= 4) return {
		type: "number",
		value: n
	};
	return {
		type: "dimension",
		value: {
			value: n,
			unit: unit || c.unit
		}
	};
}
function typography(v, c) {
	if (!isObj$1(v)) return v;
	const out = { ...v };
	if (v.fontFamily !== void 0) out.fontFamily = fontFamily(v.fontFamily);
	if (v.fontWeight !== void 0) out.fontWeight = fontWeight(v.fontWeight);
	if (v.fontSize !== void 0) out.fontSize = dimension(v.fontSize, c);
	if (v.letterSpacing !== void 0) out.letterSpacing = dimension(v.letterSpacing, c, "em");
	if (v.lineHeight !== void 0) {
		const lh = lineHeight(v.lineHeight, c);
		if (lh) out.lineHeight = lh.value;
		else delete out.lineHeight;
	}
	for (const k of ["paragraphSpacing", "paragraphIndent"]) if (v[k] !== void 0) out[k] = dimension(v[k], c);
	return out;
}
function shadowLayer(v, c) {
	if (!isObj$1(v)) return v;
	const out = {
		color: color(v.color, c),
		offsetX: dimension(v.offsetX ?? v.x ?? 0, c),
		offsetY: dimension(v.offsetY ?? v.y ?? 0, c),
		blur: dimension(v.blur ?? 0, c),
		spread: dimension(v.spread ?? 0, c)
	};
	if (v.inset !== void 0) out.inset = v.inset;
	else if (v.type === "innerShadow") out.inset = true;
	return out;
}
function border(v, c) {
	if (!isObj$1(v)) return v;
	const out = { ...v };
	if (v.color !== void 0) out.color = color(v.color, c);
	if (v.width !== void 0) out.width = dimension(v.width, c);
	return out;
}
function duration(v) {
	if (typeof v === "number") return {
		value: v,
		unit: "ms"
	};
	if (typeof v !== "string") return v;
	const m = NUM.exec(v);
	if (m && (m[2] === "" || m[2] === "ms" || m[2] === "s")) return {
		value: Number(m[1]),
		unit: m[2] || "ms"
	};
	return v;
}
/** Category/type/item naming: the first path segment says what an untyped token is. */
function inferType(path, v, c) {
	const category = path[0]?.toLowerCase();
	if (category === "color" || category === "colors") return {
		type: "color",
		value: color(v, c)
	};
	if (category === "size" || category === "sizes") return {
		type: "dimension",
		value: dimension(v, {
			...c,
			unit: "rem"
		})
	};
	if (category === "time") return {
		type: "duration",
		value: duration(v)
	};
	if (typeof v === "string" && !v.includes("{") || typeof v === "number") {
		const t = cssValueToToken(path.join("-"), String(v));
		if (t.$type === void 0 || t.$type === "css-expression" || String(v).includes("var(")) return {
			type: "other",
			value: v
		};
		return {
			type: t.$type,
			value: t.$value
		};
	}
	return {
		type: "other",
		value: v
	};
}
/**
* One token's value in DTCG form, by its (source) type. References and expressions with
* references stay as text for the core; everything literal becomes a DTCG value.
*/
function convertValue(sourceType, raw, path, c) {
	const v = normalizeRefs(raw);
	if (sourceType === "other" && typeof v === "string" && WHOLE_REF.test(v.trim())) return { value: v.trim() };
	if (sourceType === "other" && (typeof v === "number" || typeof v === "string" && !v.includes("{"))) {
		const t = inferType(path, v, c);
		return t.type === "other" ? {
			type: "other",
			value: v
		} : {
			...t,
			inferred: true
		};
	}
	if (sourceType === void 0) {
		if (typeof v === "string" && v.includes("{")) {
			deferred(v, c);
			return { value: v };
		}
		return {
			...inferType(path, v, c),
			inferred: true
		};
	}
	const type = mapType(sourceType);
	const css = (value) => typeof value === "string" && !value.includes("{") ? {
		type: "css-expression",
		value
	} : {
		type,
		value
	};
	switch (type) {
		case "color":
			if (typeof v === "string" && /gradient\(/i.test(v)) return {
				type: "css-expression",
				value: v
			};
			return css(color(v, c));
		case "dimension": return css(dimension(v, c, /letterSpacing/.test(mapKey(sourceType)) ? "em" : void 0));
		case "number": return {
			type,
			value: numberValue(v, c)
		};
		case "fontFamily": return {
			type,
			value: fontFamily(v)
		};
		case "fontWeight": return {
			type,
			value: fontWeight(v)
		};
		case "lineHeight": {
			const lh = lineHeight(v, c);
			if (!lh) return {
				type: sourceType,
				value: v
			};
			return lh.type ? lh : { value: lh.value };
		}
		case "typography": return {
			type,
			value: typography(v, c)
		};
		case "shadow": return {
			type,
			value: Array.isArray(v) ? v.map((l) => shadowLayer(l, c)) : shadowLayer(v, c)
		};
		case "border": return {
			type,
			value: border(v, c)
		};
		case "duration": return {
			type,
			value: duration(v)
		};
		default:
			if (typeof v === "string") deferred(v, c);
			return {
				type,
				value: v
			};
	}
}
/** A group's `$type` in DTCG terms; undefined when it depends on each value (line heights). */
const groupType = (sourceType) => {
	const t = mapType(sourceType);
	return t === "lineHeight" ? void 0 : t;
};
//#endregion
//#region ../dsgraph-adapters/dist/tokens-json.js
/** The `$extensions` key under which token-set files keep color modifiers (`modify`). */
const MODIFIER_EXTENSION = "studio.tokens";
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const base = (p) => p.slice(p.lastIndexOf("/") + 1);
const dir = (p) => p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : "";
const META = /(^|\/)\$(themes|metadata)\.json$/;
/** `{ value }` without `$`: a token in value/type JSON, the older token notation. */
function isLegacyToken(o) {
	if (!Object.hasOwn(o, "value") || Object.hasOwn(o, "$value")) return false;
	const v = o.value;
	return "type" in o || !isObj(v) || !Object.values(v).every(isObj);
}
/** A token whose values per mode sit under `sets`: `{ "sets": { "light": { "value" }, "dark": … } }`. */
function isSetToken(o) {
	if (Object.hasOwn(o, "value") || Object.hasOwn(o, "$value") || !isObj(o.sets)) return false;
	const sets = Object.values(o.sets);
	return sets.length > 0 && sets.every((v) => isObj(v) && (Object.hasOwn(v, "value") || isSetToken(v)));
}
const isToken = (o) => Object.hasOwn(o, "$value") || isLegacyToken(o) || isSetToken(o);
/** A type named by the token's `$schema` link (`…/token-types/color.json`); aliases and sets have none. */
function schemaType(o) {
	const m = typeof o.$schema === "string" ? /token-types\/([\w-]+)\.json$/.exec(o.$schema) : null;
	return m && m[1] !== "alias" && !m[1].endsWith("-set") ? m[1] : void 0;
}
/** Leaves of `sets`, nested sets joined with ` / `. */
function setLeaves(o, prefix = "") {
	const out = [];
	for (const [name, v] of Object.entries(o.sets)) {
		const mode = prefix ? `${prefix} / ${name}` : name;
		if (isSetToken(v)) out.push(...setLeaves(v, mode));
		else out.push([mode, v]);
	}
	return out;
}
/** A `sets` token as one token with its values per mode in `$extensions.mode`. */
function fromSets(o) {
	const leaves = setLeaves(o);
	const { sets: _sets, ...rest } = o;
	const type = schemaType(o) ?? leaves.map(([, l]) => l.type ?? schemaType(l)).find((t) => typeof t === "string");
	const token = {
		...rest,
		value: leaves[0][1].value
	};
	if (type) token.type = type;
	token.$extensions = {
		...isObj(o.$extensions) ? o.$extensions : {},
		mode: Object.fromEntries(leaves.map(([m, l]) => [m, l.value]))
	};
	return token;
}
const newSurvey = () => ({
	legacy: 0,
	dtcg: 0,
	typed: 0,
	setTypes: 0,
	values: /* @__PURE__ */ new Set(),
	ids: /* @__PURE__ */ new Set()
});
function survey(node, s, inheritsType = false, path = []) {
	if (!isObj(node)) return;
	const tree = isSetToken(node) ? fromSets(node) : node;
	if (isToken(tree)) {
		const dollar = Object.hasOwn(tree, "$value");
		if (dollar) s.dtcg++;
		else s.legacy++;
		const own = node.type ?? node.$type;
		if (typeof own === "string" || inheritsType || schemaType(tree)) s.typed++;
		if (typeof own === "string" && SET_FORMAT_TYPES.has(own)) s.setTypes++;
		const v = dollar ? tree.$value : tree.value;
		if (typeof v === "string" && !v.includes("{") || typeof v === "number") s.values.add(String(v).trim().toLowerCase());
		s.ids.add(path.join("."));
		return;
	}
	const groupType = typeof tree.$type === "string";
	if (groupType && SET_FORMAT_TYPES.has(tree.$type)) s.setTypes++;
	for (const [k, v] of Object.entries(tree)) if (!k.startsWith("$")) survey(v, s, inheritsType || groupType, [...path, k]);
}
/** JSON Schema documents describe tokens; they are not tokens. */
const isJsonSchema = (tree) => isObj(tree) && (typeof tree.$schema === "string" && /json-schema\.org/.test(tree.$schema) || isObj(tree.properties) && ("type" in tree || "allOf" in tree || "$id" in tree));
async function readAll(source, config, diag) {
	const exclude = excludeFor(config, "tokens");
	const files = (await source.list(config.tokens?.include ?? ["**/*.json", "**/*.json5"])).filter((p) => /\.(json5?|tokens)$/i.test(p) && !matchGlob(p, exclude) && (META.test(p) || !NOT_TOKENS.test(p))).sort().slice(0, 2e3);
	const out = [];
	await prefetch(source, files);
	for (const file of files) {
		const text = await source.readText(file);
		if (!META.test(file) && !/["']?\$?value["']?\s*:|"sets"\s*:/.test(text)) continue;
		try {
			const tree = parseJsonLenient(text).value;
			if (isJsonSchema(tree)) continue;
			out.push({
				file,
				tree
			});
		} catch (e) {
			diag?.error("tokens/invalid-json", e.message, { file });
		}
	}
	return out;
}
const hasMarkers = (f) => META.test(f.file) || isObj(f.tree) && ("$themes" in f.tree || "$metadata" in f.tree);
/**
* Which tool wrote these files, or undefined for typed DTCG (left to the core). DTCG syntax
* without any `$type` is read like value/type JSON: types come from names and values.
*/
function dialectOf(files) {
	const s = newSurvey();
	for (const f of files) survey(f.tree, s);
	const tokenFiles = files.filter((f) => !hasMarkers(f));
	const setsAtTop = tokenFiles.length === 1 && isObj(tokenFiles[0].tree) && topLevelAreSets(tokenFiles[0].tree);
	if (files.some(hasMarkers) || s.setTypes > 0 || setsAtTop) return "token-sets";
	if (s.legacy > 0) return "legacy-json";
	if (s.dtcg > 0 && s.typed === 0) return "legacy-json";
}
/** Prefer the export with the most typed tokens; then DTCG, token sets, value/type JSON. */
function rankOf(s) {
	return Math.round(s.typed / Math.max(1, s.legacy + s.dtcg) * 10) * 10 + (s.setTypes > 0 ? 3 : s.legacy > 0 ? 2 : 4);
}
const jaccard = (a, b) => {
	let common = 0;
	for (const v of a) if (b.has(v)) common++;
	return common / (a.size + b.size - common);
};
/**
* Two files are exports of the same tokens when they are about the same size, their literal
* values mostly coincide, and they differ in format or repeat the same token names. Sibling
* files of one system share many values (8px, 12px) but not their size, format and names.
*/
function alternatives(a, b) {
	const na = a.legacy + a.dtcg;
	const nb = b.legacy + b.dtcg;
	if (Math.min(na, nb) / Math.max(na, nb) < .7) return false;
	if (jaccard(a.values, b.values) < .5) return false;
	return !(a.setTypes > 0 === b.setTypes > 0 && a.dtcg > 0 === b.dtcg > 0) || jaccard(a.ids, b.ids) >= .8;
}
/**
* Packages often ship the same tokens in several formats (`tokens.json`,
* `tokens.figma.json`, `tokens.legacy.json`). Files whose literal values mostly
* coincide are alternatives: only the best-typed one is read.
*/
function pickExports(files, diag) {
	const info = files.filter((f) => !hasMarkers(f)).map((f) => {
		const s = newSurvey();
		survey(f.tree, s);
		return {
			f,
			s
		};
	}).filter((x) => x.s.values.size >= 10);
	if (info.length < 2 || info.length > 200) return files;
	const parent = info.map((_, i) => i);
	const find = (i) => {
		while (parent[i] !== i) i = parent[i];
		return i;
	};
	for (let i = 0; i < info.length; i++) for (let j = i + 1; j < info.length; j++) if (alternatives(info[i].s, info[j].s)) parent[find(i)] = find(j);
	const clusters = /* @__PURE__ */ new Map();
	for (const [i, x] of info.entries()) clusters.set(find(i), [...clusters.get(find(i)) ?? [], x]);
	const dropped = /* @__PURE__ */ new Set();
	for (const list of clusters.values()) {
		if (list.length < 2) continue;
		const [best, ...rest] = [...list].sort((x, y) => rankOf(y.s) - rankOf(x.s) || y.s.legacy + y.s.dtcg - (x.s.legacy + x.s.dtcg) || x.f.file.localeCompare(y.f.file));
		for (const r of rest) dropped.add(r.f.file);
		diag?.info("tokens/alternative-exports", `${rest.map((r) => `"${r.f.file}"`).join(", ")} repeat the tokens of "${best.f.file}"; reading "${best.f.file}"`);
	}
	return files.filter((f) => !dropped.has(f.file));
}
const DTCG_PROPS = /* @__PURE__ */ new Set([
	"$type",
	"$description",
	"$deprecated",
	"$extensions"
]);
/** Converts a token tree to DTCG 2025.10. Group types are carried down to convert values. */
function convertTree(tree, dialect, unit, path = [], type) {
	if (!isObj(tree)) return tree;
	const out = {};
	const inherited = typeof tree.$type === "string" ? tree.$type : type;
	for (const [k, v] of Object.entries(tree)) {
		if (k.startsWith("$")) {
			if (k === "$type" && typeof v === "string") {
				const t = groupType(v);
				if (t) out.$type = t;
			} else if (DTCG_PROPS.has(k)) out[k] = v;
			continue;
		}
		if (!isObj(v)) continue;
		const segs = splitName(k);
		const at = [...path, ...segs];
		place(out, segs, isToken(v) ? convertToken(v, at, dialect, unit, inherited) : convertTree(v, dialect, unit, at, inherited));
	}
	return out;
}
/** `a/b.c` → `[a, b, c]`; decimal steps such as `0.5` stay whole. */
function splitName(key) {
	if (!/[./]/.test(key)) return [key];
	return key.split("/").flatMap((part) => /^\d+\.\d+$/.test(part) ? [part] : part.split(".")).filter((p) => p !== "");
}
/**
* Puts a converted node at a path. Flat names can make one path both a token and a group
* (`color.bg` and `color.bg.hovered`); the token then becomes the group's `$root`.
*/
function place(out, segs, value) {
	const isTok = (v) => isObj(v) && "$value" in v;
	let node = out;
	for (const seg of segs.slice(0, -1)) {
		const cur = node[seg];
		if (isTok(cur)) node[seg] = { $root: cur };
		else if (!isObj(cur)) node[seg] = {};
		node = node[seg];
	}
	const last = segs[segs.length - 1];
	const prev = node[last];
	if (!isObj(prev) || !isObj(value)) {
		node[last] = value;
		return;
	}
	const a = prev;
	const b = value;
	if (isTok(b) && !isTok(a)) node[last] = {
		...a,
		$root: b
	};
	else if (!isTok(b) && isTok(a)) node[last] = {
		...b,
		$root: a
	};
	else if (!isTok(b)) node[last] = {
		...a,
		...b
	};
	else node[last] = b;
}
function convertToken(node, path, dialect, unit, inherited) {
	if (isSetToken(node)) node = fromSets(node);
	const dollar = Object.hasOwn(node, "$value");
	const raw = dollar ? node.$value : node.value;
	const ownType = (dollar ? node.$type : node.type) ?? (dollar ? void 0 : node.$type) ?? schemaType(node);
	const c = {
		dialect,
		unit,
		expression: false
	};
	const sourceType = typeof ownType === "string" ? ownType : inherited;
	const { type, value, inferred } = convertValue(sourceType, raw, path, c);
	const token = { $value: value };
	if (type && (typeof ownType === "string" || type !== (inherited && groupType(inherited)))) token.$type = type;
	const description = node.$description ?? node.description ?? node.comment;
	if (typeof description === "string" && description !== "") token.$description = description;
	const deprecated = node.$deprecated ?? node.deprecated;
	if (typeof deprecated === "boolean" || typeof deprecated === "string") {
		const comment = node.deprecated_comment;
		token.$deprecated = deprecated === true && typeof comment === "string" ? comment : deprecated;
	}
	const ext = {
		...isObj(node.extensions) ? node.extensions : {},
		...isObj(node.$extensions) ? normalizeRefs(node.$extensions) : {}
	};
	if (isObj(ext.mode)) ext.mode = Object.fromEntries(Object.entries(ext.mode).map(([m, v]) => [m, convertValue(type ?? sourceType, v, path, c).value]));
	const dev = {};
	if (inferred) dev.typeInferred = true;
	if (c.expression) dev.expression = { unit };
	if (sourceType && sourceType !== type) dev.sourceType = sourceType;
	if (typeof node.uuid === "string" && node.uuid) dev.stableId = node.uuid;
	const carrier = ext[MODIFIER_EXTENSION];
	if (isObj(carrier) && isObj(carrier.modify) && typeof carrier.modify.type === "string") {
		const m = carrier.modify;
		dev.colorModifier = {
			type: m.type,
			value: m.value,
			space: m.space,
			color: m.color
		};
	}
	if (Object.keys(dev).length > 0) ext["dev.dsgraph"] = dev;
	if (Object.keys(ext).length > 0) token.$extensions = ext;
	return token;
}
function themesOf(raw, diag, file) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const t of raw) {
		if (!isObj(t) || typeof t.name !== "string") continue;
		const sets = /* @__PURE__ */ new Map();
		if (isObj(t.selectedTokenSets)) {
			for (const [k, v] of Object.entries(t.selectedTokenSets)) if (typeof v === "string") sets.set(k, v);
		}
		out.push({
			name: t.name,
			group: typeof t.group === "string" && t.group ? t.group : "theme",
			sets
		});
	}
	if (out.length === 0 && raw.length > 0) diag.warn("token-sets/invalid-themes", "No usable themes found", { file });
	return out;
}
/** Ids of tokens in a tree, prefixed by `prefix`. */
function tokenIds(tree, prefix, out) {
	if (!isObj(tree)) return;
	for (const [k, v] of Object.entries(tree)) {
		if (k.startsWith("$") || !isObj(v)) continue;
		if (isToken(v)) out.add([...prefix, k].join("."));
		else tokenIds(v, [...prefix, k], out);
	}
}
function refsIn(v, out) {
	if (typeof v === "string") for (const m of v.matchAll(/\{([^{}]+)\}/g)) out.push(m[1].replace(/\.\$?value$/, ""));
	else if (Array.isArray(v)) for (const x of v) refsIn(x, out);
	else if (isObj(v)) for (const x of Object.values(v)) refsIn(x, out);
}
/**
* A single exported token-set file keeps its sets as top-level keys; references then leave the set
* name out. Without `$themes`/`$metadata` the references decide which reading resolves more.
*/
function topLevelAreSets(tree) {
	if ("$themes" in tree || "$metadata" in tree) return true;
	const asGroups = /* @__PURE__ */ new Set();
	const asSets = /* @__PURE__ */ new Set();
	tokenIds(tree, [], asGroups);
	for (const [k, v] of Object.entries(tree)) if (!k.startsWith("$")) tokenIds(v, [], asSets);
	const refs = [];
	refsIn(tree, refs);
	if (refs.length === 0) return false;
	const hits = (ids) => refs.filter((r) => ids.has(r)).length;
	return hits(asSets) > hits(asGroups);
}
function setsSystem(files, diag) {
	const unit = "px";
	const sets = /* @__PURE__ */ new Map();
	let order;
	let themes = [];
	const metaFile = files.find((f) => base(f.file) === "$metadata.json");
	const themesFile = files.find((f) => base(f.file) === "$themes.json");
	const root = dir((metaFile ?? themesFile)?.file ?? "");
	if (metaFile && isObj(metaFile.tree) && Array.isArray(metaFile.tree.tokenSetOrder)) order = metaFile.tree.tokenSetOrder.filter((s) => typeof s === "string");
	if (themesFile) themes = themesOf(themesFile.tree, diag, themesFile.file);
	const single = files.filter((f) => !META.test(f.file)).length === 1;
	for (const f of files) {
		if (META.test(f.file) || !isObj(f.tree)) continue;
		if (isObj(f.tree.$metadata) && Array.isArray(f.tree.$metadata.tokenSetOrder)) order ??= f.tree.$metadata.tokenSetOrder.filter((s) => typeof s === "string");
		if (f.tree.$themes) themes = themes.length ? themes : themesOf(f.tree.$themes, diag, f.file);
		if ("$themes" in f.tree || "$metadata" in f.tree || single && topLevelAreSets(f.tree)) {
			for (const [name, tree] of Object.entries(f.tree)) if (!name.startsWith("$") && isObj(tree)) sets.set(name, {
				file: `${f.file}#/${name}`,
				tree: convertTree(tree, "token-sets", unit)
			});
		} else {
			const name = (root && f.file.startsWith(`${root}/`) ? f.file.slice(root.length + 1) : f.file).replace(/\.(json|tokens)$/i, "");
			sets.set(name, {
				file: f.file,
				tree: convertTree(f.tree, "token-sets", unit)
			});
		}
	}
	const names = [...(order ?? []).filter((n) => sets.has(n)), ...[...sets.keys()].filter((n) => !order?.includes(n))];
	const docs = (list) => list.map((n) => sets.get(n));
	const system = {
		sets: /* @__PURE__ */ new Map(),
		modifiers: /* @__PURE__ */ new Map(),
		order: [{
			kind: "set",
			name: "base"
		}],
		synthetic: true,
		kind: "token-sets"
	};
	if (themes.length === 0) {
		system.sets.set("base", docs(names));
		if (sets.size > 1) diag.info("token-sets/no-themes", `No themes: ${sets.size} token sets are merged in set order`);
		return system;
	}
	const used = (t) => new Set(names.filter((n) => t.sets.get(n) === "enabled" || t.sets.get(n) === "source"));
	const groups = /* @__PURE__ */ new Map();
	for (const t of themes) groups.set(t.group, [...groups.get(t.group) ?? [], t]);
	const switching = themes.filter((t) => groups.get(t.group).length > 1);
	const fixed = new Set(themes.filter((t) => !switching.includes(t)).flatMap((t) => [...used(t)]));
	const shared = names.filter((n) => fixed.has(n) || switching.length > 0 && switching.every((t) => used(t).has(n)));
	system.sets.set("base", docs(shared));
	for (const [group, list] of groups) {
		if (list.length < 2) continue;
		const contexts = /* @__PURE__ */ new Map();
		for (const t of list) {
			const u = used(t);
			contexts.set(t.name, docs(names.filter((n) => u.has(n) && !shared.includes(n))));
		}
		system.modifiers.set(group, {
			contexts,
			default: list[0].name
		});
		system.order.push({
			kind: "modifier",
			name: group
		});
	}
	const unused = names.filter((n) => !themes.some((t) => used(t).has(n)));
	if (unused.length > 0) diag.info("token-sets/unused-sets", `Token sets in no theme are not read: ${unused.join(", ")}`);
	return system;
}
/**
* Token-set JSON and value/type JSON → token system (DTCG 2025.10 values).
* Token sets: one file each or top-level keys of one file, `$metadata.json` for
* set order and `$themes.json` for themes; theme groups become modifiers. Value/type JSON: every
* file merges into one set, untyped tokens take their type from the category (`color`, `size`,
* `time`) or the value. Plain DTCG files are left to the core.
*/
const jsonTokens = {
	name: "tokens-json",
	priority: "first",
	async detect(source, config) {
		const files = pickExports(await readAll(source, config));
		return dialectOf(files) ? files.map((f) => f.file) : [];
	},
	async load(source, files, config, diag) {
		const wanted = new Set(files);
		const all = await readAll(source, config, diag);
		pickExports(all, diag);
		const loaded = all.filter((f) => wanted.has(f.file));
		if ((dialectOf(loaded) ?? "legacy-json") === "token-sets") return setsSystem(loaded, diag);
		const docs = loaded.map((f) => ({
			file: f.file,
			tree: convertTree(f.tree, "legacy-json", "px")
		}));
		return {
			sets: /* @__PURE__ */ new Map([["default", docs]]),
			modifiers: /* @__PURE__ */ new Map(),
			order: [{
				kind: "set",
				name: "default"
			}],
			synthetic: true,
			kind: "legacy-json"
		};
	}
};
//#endregion
//#region ../dsgraph-sources/dist/github.js
/**
* Files of a GitHub repository at a ref (branch, tag or commit). Works in the browser:
* the tree comes from the REST API (60 requests/hour without a token), contents from
* raw.githubusercontent.com, or from the API when a token is given (private repositories).
*/
var GitHubSource = class {
	repo;
	ref;
	opts;
	id;
	sha;
	files;
	root;
	api;
	raw;
	fetchImpl;
	texts = /* @__PURE__ */ new Map();
	constructor(repo, ref = "HEAD", opts = {}) {
		this.repo = repo;
		this.ref = ref;
		this.opts = opts;
		if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error(`Repository must be "owner/name", got "${repo}"`);
		this.root = (opts.root ?? "").replace(/^\/+|\/+$/g, "");
		this.id = `github:${repo}@${ref}${this.root ? `/${this.root}` : ""}`;
		this.api = opts.api ?? "https://api.github.com";
		this.raw = opts.raw ?? "https://raw.githubusercontent.com";
		this.fetchImpl = opts.fetch ?? globalThis.fetch.bind(globalThis);
	}
	async apiJson(path) {
		const headers = { Accept: "application/vnd.github+json" };
		if (this.opts.token) headers.Authorization = `Bearer ${this.opts.token}`;
		const res = await this.fetchImpl(`${this.api}${path}`, { headers });
		if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
		return res.json();
	}
	/** Exact commit sha of the ref, so that every read is consistent. */
	async commit() {
		if (!this.sha) {
			const data = await this.apiJson(`/repos/${this.repo}/commits/${encodeURIComponent(this.ref)}`);
			this.sha = data.sha;
		}
		return this.sha;
	}
	async list(patterns) {
		if (!this.files) {
			const sha = await this.commit();
			const data = await this.apiJson(`/repos/${this.repo}/git/trees/${sha}?recursive=1`);
			if (data.truncated) throw new Error(`Repository tree of ${this.repo} is too large; set "root" to a subdirectory`);
			const prefix = this.root ? `${this.root}/` : "";
			this.files = data.tree.filter((e) => e.type === "blob" && e.path.startsWith(prefix)).map((e) => e.path.slice(prefix.length)).sort();
		}
		return this.files.filter((p) => matchGlob(p, patterns));
	}
	/** Cached: adapters detect and then load the same files. */
	readText(path) {
		let p = this.texts.get(path);
		if (!p) {
			p = this.fetchText(path);
			p.catch(() => this.texts.delete(path));
			this.texts.set(path, p);
		}
		return p;
	}
	async fetchText(path) {
		const sha = await this.commit();
		const encoded = ((this.root ? `${this.root}/` : "") + path.replace(/^\//, "")).split("/").map(encodeURIComponent).join("/");
		const res = this.opts.token ? await this.fetchImpl(`${this.api}/repos/${this.repo}/contents/${encoded}?ref=${sha}`, { headers: {
			Accept: "application/vnd.github.raw",
			Authorization: `Bearer ${this.opts.token}`
		} }) : await this.fetchImpl(`${this.raw}/${this.repo}/${sha}/${encoded}`);
		if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
		return res.text();
	}
	async meta() {
		const m = {
			kind: "github",
			repo: this.repo,
			ref: this.ref,
			commit: await this.commit()
		};
		if (this.root) m.path = this.root;
		return m;
	}
};
//#endregion
//#region ../dsgraph-sources/dist/memory.js
/** In-memory source: dropped files in the browser, fixtures in tests. */
var MemorySource = class {
	id;
	files;
	sourceMeta;
	constructor(files, meta = { kind: "files" }) {
		this.files = new Map(Object.entries(files).map(([path, content]) => [path.replace(/^\.?\//, ""), typeof content === "string" ? content : JSON.stringify(content)]));
		this.sourceMeta = meta;
		this.id = `${meta.kind}:`;
	}
	async list(patterns) {
		return [...this.files.keys()].filter((p) => matchGlob(p, patterns)).sort();
	}
	async readText(path) {
		const content = this.files.get(path.replace(/^\.?\//, ""));
		if (content === void 0) throw new Error(`File not found: ${path}`);
		return content;
	}
	async meta() {
		return this.sourceMeta;
	}
};
//#endregion
//#region ../dsgraph-sources/dist/npm.js
/**
* Files of a published npm package via jsDelivr (CORS-enabled, works in the browser).
* `version` may be a range or a dist-tag; it is resolved to an exact version first.
*/
var NpmSource = class {
	pkg;
	version;
	id;
	resolved;
	fileList;
	dataApi;
	cdn;
	fetchImpl;
	texts = /* @__PURE__ */ new Map();
	constructor(pkg, version = "latest", opts = {}) {
		this.pkg = pkg;
		this.version = version;
		this.id = `npm:${pkg}@${version}`;
		this.dataApi = opts.dataApi ?? "https://data.jsdelivr.com/v1";
		this.cdn = opts.cdn ?? "https://cdn.jsdelivr.net/npm";
		this.fetchImpl = opts.fetch ?? globalThis.fetch.bind(globalThis);
	}
	async json(url) {
		const res = await this.fetchImpl(url);
		if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
		return res.json();
	}
	async resolveVersion() {
		if (!this.resolved) {
			const data = await this.json(`${this.dataApi}/packages/npm/${this.pkg}/resolved?specifier=${encodeURIComponent(this.version)}`);
			if (!data.version) throw new Error(`Cannot resolve ${this.pkg}@${this.version}`);
			this.resolved = data.version;
		}
		return this.resolved;
	}
	async list(patterns) {
		if (!this.fileList) {
			const v = await this.resolveVersion();
			const data = await this.json(`${this.dataApi}/packages/npm/${this.pkg}@${v}?structure=flat`);
			this.fileList = data.files.map((f) => f.name.replace(/^\//, "")).sort();
		}
		return this.fileList.filter((p) => matchGlob(p, patterns));
	}
	/** Cached: adapters detect and then load the same files. */
	readText(path) {
		let p = this.texts.get(path);
		if (!p) {
			p = this.fetchText(path);
			p.catch(() => this.texts.delete(path));
			this.texts.set(path, p);
		}
		return p;
	}
	async fetchText(path) {
		const v = await this.resolveVersion();
		const res = await this.fetchImpl(`${this.cdn}/${this.pkg}@${v}/${path.replace(/^\//, "")}`);
		if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
		return res.text();
	}
	async meta() {
		return {
			kind: "npm",
			package: this.pkg,
			version: await this.resolveVersion()
		};
	}
};
//#endregion
//#region ../dsgraph-sources/dist/spec.js
const NPM = /^npm:((?:@[\w.-]+\/)?[\w.-]+)(?:@(.+))?$/;
const GITHUB = /^github:([\w.-]+\/[\w.-]+)(\/[^@]+)?(?:@(.+))?$/;
function parseRemoteSpec(spec) {
	const npm = NPM.exec(spec.trim());
	if (npm) return {
		kind: "npm",
		pkg: npm[1],
		version: npm[2] ?? "latest"
	};
	const gh = GITHUB.exec(spec.trim());
	if (gh) {
		const out = {
			kind: "github",
			repo: gh[1],
			ref: gh[3] ?? "HEAD"
		};
		if (gh[2]) out.root = gh[2].slice(1);
		return out;
	}
	return null;
}
function remoteSource(spec, opts = {}) {
	if (spec.kind === "npm") return new NpmSource(spec.pkg, spec.version, opts.fetch ? { fetch: opts.fetch } : {});
	const o = {};
	if (spec.root) o.root = spec.root;
	if (opts.token) o.token = opts.token;
	if (opts.fetch) o.fetch = opts.fetch;
	return new GitHubSource(spec.repo, spec.ref, o);
}
//#endregion
//#region ../dsgraph-sources/dist/node.js
const SKIP = /* @__PURE__ */ new Set(["node_modules", ".git"]);
/** Node file system rooted at a directory. CLI and GitHub Action only. */
var NodeFsSource = class {
	root;
	id;
	files;
	constructor(root) {
		this.root = root;
		this.id = `node:${root}`;
	}
	async walk() {
		const out = [];
		const visit = async (dir) => {
			for (const entry of await readdir(dir, { withFileTypes: true })) if (entry.isDirectory()) {
				if (!SKIP.has(entry.name)) await visit(join(dir, entry.name));
			} else if (entry.isFile()) out.push(relative(this.root, join(dir, entry.name)).split(sep).join("/"));
		};
		await visit(this.root);
		return out.sort();
	}
	async list(patterns) {
		this.files ??= await this.walk();
		return this.files.filter((p) => matchGlob(p, patterns));
	}
	async readText(path) {
		return readFile(join(this.root, ...path.split("/")), "utf8");
	}
	async meta() {
		return {
			kind: "folder",
			path: this.root
		};
	}
};
//#endregion
//#region ../dsgraph-cli/dist/sources.js
/**
* Turns a source argument into a graph:
* `npm:@scope/pkg@^2`, `github:owner/repo/path@ref`, a folder, a token file (.json, .tokens, .css,
* .resolver.json) or a saved snapshot (`dsgraph scan --out`).
*/
async function loadGraph(spec, config, cwd) {
	const { source, config: cfg, snapshot } = await toSource(spec, config, cwd);
	if (snapshot) return DsGraph.from(snapshot);
	return DsGraph.from(await scan(source, cfg, { adapters: [jsonTokens, cssTokens] }));
}
async function toSource(spec, config, cwd) {
	const remote = parseRemoteSpec(spec);
	if (remote) {
		const token = process.env.GITHUB_TOKEN;
		return {
			source: remoteSource(remote, token ? { token } : {}),
			config
		};
	}
	const path = resolve(cwd, spec);
	const info = await stat(path).catch(() => void 0);
	if (!info) throw new Error(`Source not found: ${spec}`);
	if (info.isDirectory()) return {
		source: new NodeFsSource(path),
		config
	};
	const name = basename(path);
	if (name.endsWith(".resolver.json")) return {
		source: new NodeFsSource(dirname(path)),
		config: {
			...config,
			tokens: {
				...config.tokens,
				resolver: name
			}
		}
	};
	const text = await readFile(path, "utf8");
	if (name.endsWith(".json")) try {
		const parsed = JSON.parse(text);
		if (parsed.schema === "dsgraph/snapshot@1") {
			const v = validateSnapshot(parsed);
			if (!v.ok) throw new Error(`Invalid snapshot ${spec}: ${v.errors[0]?.path} ${v.errors[0]?.message}`);
			return {
				snapshot: parsed,
				config
			};
		}
	} catch (e) {
		if (e.message.startsWith("Invalid snapshot")) throw e;
	}
	const meta = {
		kind: "files",
		path
	};
	if (name.endsWith(".css")) return {
		source: new MemorySource({ [name]: text }, meta),
		config: {
			...config,
			css: {
				...config.css,
				include: [name]
			}
		}
	};
	return {
		source: new MemorySource({ [name]: text }, meta),
		config: {
			...config,
			tokens: {
				...config.tokens,
				include: [name]
			}
		}
	};
}
/** Reads `dsgraph.config.json` (or the given file) from `cwd`; no file means an empty config. */
async function loadConfig(path, cwd) {
	const file = resolve(cwd, path ?? "dsgraph.config.json");
	let text;
	try {
		text = await readFile(file, "utf8");
	} catch {
		if (path) throw new Error(`Config not found: ${path}`);
		return {};
	}
	const config = JSON.parse(text);
	const v = validateConfig(config);
	if (!v.ok) throw new Error(`Invalid config ${file}: ${v.errors.map((e) => `${e.path} ${e.message}`).join("; ")}`);
	return config;
}
/** Diff options from the config: explicit renames, comparison thresholds, semver policy, layers. */
function diffOptions(config) {
	const opts = {};
	if (config.renames) opts.renames = config.renames;
	if (config.compare?.ignoreExtensions) opts.ignoreExtensions = config.compare.ignoreExtensions;
	if (config.compare?.equalDeltaE !== void 0) opts.compare = { equalDeltaE: config.compare.equalDeltaE };
	if (config.semver) opts.semver = config.semver;
	if (config.layers) opts.layers = config.layers;
	return opts;
}
//#endregion
//#region src/run.ts
const RANK = {
	none: 0,
	patch: 1,
	minor: 2,
	major: 3
};
const MARKER = "<!-- dsgraph-action -->";
const input = (rt, name, fallback = "") => (rt.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] ?? "").trim() || fallback;
/** Escapes a message for a workflow command (`::error::…`). */
const command = (kind, message) => `::${kind}::${message.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A")}`;
/**
* Compares the design tokens of a pull request with its base (or any dsgraph source), writes the
* report to the job summary and a pull request comment, and fails when the change is at least
* `fail-on`. Returns the exit code.
*/
async function run(rt) {
	const workspace = rt.env.GITHUB_WORKSPACE ?? process.cwd();
	const repo = rt.env.GITHUB_REPOSITORY ?? "";
	const token = input(rt, "github-token");
	const path = input(rt, "path", ".");
	const failOn = input(rt, "fail-on");
	if (failOn && !(failOn in RANK)) {
		rt.log(command("error", "`fail-on` must be major, minor, patch or none"));
		return 2;
	}
	let pr;
	if (rt.env.GITHUB_EVENT_PATH) try {
		pr = JSON.parse(await rt.readText(rt.env.GITHUB_EVENT_PATH)).pull_request;
	} catch {}
	try {
		let config = await loadConfig(input(rt, "config") || void 0, workspace);
		const headPath = resolve(workspace, path);
		const isFile = (await stat(headPath).catch(() => void 0))?.isFile() ?? false;
		const folder = relative(workspace, isFile ? dirname(headPath) : headPath).split("\\").join("/");
		if (isFile) {
			const name = basename(headPath);
			config = /\.css$/i.test(name) ? {
				...config,
				css: {
					...config.css,
					include: [name]
				}
			} : {
				...config,
				tokens: {
					...config.tokens,
					include: [name]
				}
			};
		}
		let baseSpec = input(rt, "base");
		if (!baseSpec) {
			if (!pr) {
				rt.log(command("error", "Set `base`, or run the action on pull_request"));
				return 2;
			}
			baseSpec = `github:${repo}${folder && folder !== "." ? `/${posix.normalize(folder)}` : ""}@${pr.base.sha}`;
		}
		const [base, head] = await Promise.all([loadGraph(baseSpec, config, workspace), isFile ? loadGraph(folder || ".", config, workspace) : loadGraph(headPath, config, workspace)]);
		const cs = await diff(base, head, diffOptions(config));
		const types = new Map([...base.tokens(), ...head.tokens()].map((t) => [t.id, t.type]));
		const level = cs.changes.length ? cs.summary.level : "none";
		const here = path === "." ? "this branch" : path;
		let body = formatChangeset(cs, {
			format: "markdown",
			types
		}).split(headPath).join(here).split(`${workspace}/`).join("");
		if (input(rt, "checks", "true") !== "false") {
			const findings = await check(head, config);
			if (findings.length) body += `\n<details><summary>Checks on the new version (${findings.length})</summary>\n\n${formatFindings(findings, { format: "markdown" })}\n</details>\n`;
		}
		body += "\n<sub>[dsgraph](https://github.com/specsure/specsure) · design tokens compared as a graph</sub>\n";
		if (rt.env.GITHUB_STEP_SUMMARY) await rt.appendText(rt.env.GITHUB_STEP_SUMMARY, `${body}\n`);
		if (rt.env.GITHUB_OUTPUT) await rt.appendText(rt.env.GITHUB_OUTPUT, `level=${level}\nchanges=${cs.changes.filter((c) => c.origin === "direct").length}\nbreaking=${cs.changes.filter((c) => c.level === "major").length}\n`);
		rt.log(`dsgraph: ${level === "none" ? "no impact" : `${level} release`} (${baseSpec} → ${path})`);
		if (pr && token && input(rt, "comment", "true") !== "false") await comment(rt, {
			repo,
			pr: pr.number,
			token,
			body: `${MARKER}\n${fit(body)}`,
			empty: cs.changes.length === 0
		});
		if (failOn && cs.changes.length && RANK[level] >= RANK[failOn]) {
			rt.log(command("error", `Design tokens: ${level} change, fail-on is ${failOn}`));
			return 1;
		}
		return 0;
	} catch (e) {
		rt.log(command("error", `dsgraph: ${e.message}`));
		return 2;
	}
}
/** GitHub refuses comments over 65 536 characters; a long report is cut at a line, the summary keeps all of it. */
function fit(body, limit = 6e4) {
	if (body.length <= limit) return body;
	const cut = body.slice(0, limit);
	const kept = cut.slice(0, cut.lastIndexOf("\n"));
	const open = (kept.match(/<details>/g) ?? []).length - (kept.match(/<\/details>/g) ?? []).length;
	return `${kept}\n${"</details>\n".repeat(Math.max(0, open))}\n…and more. The full report is in the job summary.\n`;
}
/**
* One comment per pull request, updated on every push. Nothing is posted while there are no
* changes; a comment that exists already says so. Without permission (pull requests from forks)
* it warns and goes on: the report is in the job summary.
*/
async function comment(rt, o) {
	const api = rt.env.GITHUB_API_URL ?? "https://api.github.com";
	const headers = {
		Accept: "application/vnd.github+json",
		Authorization: `Bearer ${o.token}`,
		"X-GitHub-Api-Version": "2022-11-28",
		"Content-Type": "application/json"
	};
	try {
		let existing;
		for (let page = 1; page <= 10 && existing === void 0; page++) {
			const res = await rt.fetch(`${api}/repos/${o.repo}/issues/${o.pr}/comments?per_page=100&page=${page}`, { headers });
			if (!res.ok) throw new Error(`${res.status} listing comments`);
			const list = await res.json();
			existing = list.find((c) => c.body?.startsWith(MARKER))?.id;
			if (list.length < 100) break;
		}
		if (existing === void 0 && o.empty) return;
		const res = existing ? await rt.fetch(`${api}/repos/${o.repo}/issues/comments/${existing}`, {
			method: "PATCH",
			headers,
			body: JSON.stringify({ body: o.body })
		}) : await rt.fetch(`${api}/repos/${o.repo}/issues/${o.pr}/comments`, {
			method: "POST",
			headers,
			body: JSON.stringify({ body: o.body })
		});
		if (!res.ok) throw new Error(`${res.status} writing the comment`);
	} catch (e) {
		rt.log(command("warning", `Could not comment on the pull request (${e.message}). Give the job \`pull-requests: write\`; the report is in the job summary.`));
	}
}
//#endregion
//#region src/index.ts
const token = process.env["INPUT_GITHUB-TOKEN"]?.trim();
if (token && !process.env.GITHUB_TOKEN) process.env.GITHUB_TOKEN = token;
process.exitCode = await run({
	env: process.env,
	readText: (path) => readFile(path, "utf8"),
	appendText: (path, text) => appendFile(path, text),
	fetch: globalThis.fetch.bind(globalThis),
	log: (line) => console.log(line)
});
//#endregion
export {};
