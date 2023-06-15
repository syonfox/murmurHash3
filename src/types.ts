export type Brand<Name, Type> = Type & {_type?: Name};

export type U32 = Brand<"u32", number>;
export type U64 = Brand<"u64", [U32, U32]>;

// 16bit chunks in big endian as u32s to allow carrying of overflows.
export type U64Spill = Brand<"u64spill", [U32, U32, U32, U32]>;

export type X86Hash32State = {
  h1: U32;
  len: number;
  rem: Uint8Array;
};

export type X86Hash128State = {
  h1: U32;
  h2: U32;
  h3: U32;
  h4: U32;
  len: number;
  rem: Uint8Array;
};

export type X64Hash128State = {
  h1: U64;
  h2: U64;
  len: number;
  rem: Uint8Array;
};
