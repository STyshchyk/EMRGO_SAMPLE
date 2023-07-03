import { ComponentPropsWithRef, ComponentType } from "react";

type TJoin<Left, Right> = Left extends string | number
  ? Right extends string | number
    ? "" extends Left
      ? Right
      : `${Left}.${Right}`
    : never
  : never;

export type TPathValues<Type, Prefix = ""> = {
  [Key in keyof Type]: Type[Key] extends Record<string, unknown> | unknown[] | readonly unknown[]
    ? [TJoin<Prefix, Key>, Type[Key]] | TPathValues<Type[Key], TJoin<Prefix, Key>>
    : [TJoin<Prefix, Key>, Type[Key]];
}[Type extends unknown[] | readonly unknown[] ? Exclude<keyof Type, keyof unknown[]> : keyof Type];

export type TPaths<TypePathValues extends [unknown, unknown]> = TypePathValues[0];

export type TPathValue<
  Path extends TypePathValues[0],
  TypePathValues extends [unknown, unknown]
> = TypePathValues extends [Path, unknown] ? TypePathValues[1] : never;

export type TNullable<Type> = Type | null;

export type TAsComponentProps<AsComponent> = {
  as?: AsComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & (AsComponent extends keyof JSX.IntrinsicElements | ComponentType<any>
  ? ComponentPropsWithRef<AsComponent>
  : unknown);
