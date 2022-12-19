/*
** DON'T EDIT THIS FILE **
It's been generated by Zapatos, and is liable to be overwritten

Zapatos: https://jawj.github.io/zapatos/
Copyright (C) 2020 - 2022 George MacKerron
Released under the MIT licence: see LICENCE file
*/

declare module 'zapatos/schema' {

  import type * as db from 'zapatos/db';

  // got a type error on schemaVersionCanary below? update by running `npx zapatos`
  export interface schemaVersionCanary extends db.SchemaVersionCanary { version: 104 }


  /* === schema: public === */

  /* --- enums --- */
  /* (none) */

  /* --- tables --- */

  /**
   * **Message**
   * - Table in database
   */
  export namespace Message {
    export type Table = 'Message';
    export interface Selectable {
      /**
      * **Message.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id: string;
      /**
      * **Message.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **Message.sender**
      * - `uuid` in database
      * - Nullable, no default
      */
      sender: string | null;
      /**
      * **Message.receiver**
      * - `uuid` in database
      * - Nullable, no default
      */
      receiver: string | null;
      /**
      * **Message.body**
      * - `text` in database
      * - Nullable, no default
      */
      body: string | null;
    }
    export interface JSONSelectable {
      /**
      * **Message.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id: string;
      /**
      * **Message.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **Message.sender**
      * - `uuid` in database
      * - Nullable, no default
      */
      sender: string | null;
      /**
      * **Message.receiver**
      * - `uuid` in database
      * - Nullable, no default
      */
      receiver: string | null;
      /**
      * **Message.body**
      * - `text` in database
      * - Nullable, no default
      */
      body: string | null;
    }
    export interface Whereable {
      /**
      * **Message.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Message.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Message.sender**
      * - `uuid` in database
      * - Nullable, no default
      */
      sender?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Message.receiver**
      * - `uuid` in database
      * - Nullable, no default
      */
      receiver?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **Message.body**
      * - `text` in database
      * - Nullable, no default
      */
      body?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **Message.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment;
      /**
      * **Message.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **Message.sender**
      * - `uuid` in database
      * - Nullable, no default
      */
      sender?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment;
      /**
      * **Message.receiver**
      * - `uuid` in database
      * - Nullable, no default
      */
      receiver?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment;
      /**
      * **Message.body**
      * - `text` in database
      * - Nullable, no default
      */
      body?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **Message.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.DefaultType | db.SQLFragment>;
      /**
      * **Message.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **Message.sender**
      * - `uuid` in database
      * - Nullable, no default
      */
      sender?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **Message.receiver**
      * - `uuid` in database
      * - Nullable, no default
      */
      receiver?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **Message.body**
      * - `text` in database
      * - Nullable, no default
      */
      body?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'Message_pkey';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = Table | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Whereable | Column | db.ParentColumn | db.GenericSQLExpression;
    export type SQL = SQLExpression | SQLExpression[];
  }

  /**
   * **User**
   * - Table in database
   */
  export namespace User {
    export type Table = 'User';
    export interface Selectable {
      /**
      * **User.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id: string;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **User.username**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      username: string;
      /**
      * **User.password**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      password: string;
    }
    export interface JSONSelectable {
      /**
      * **User.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id: string;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **User.username**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      username: string;
      /**
      * **User.password**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      password: string;
    }
    export interface Whereable {
      /**
      * **User.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **User.username**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      username?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **User.password**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      password?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **User.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **User.username**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      username: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **User.password**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      password: string | db.Parameter<string> | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **User.id**
      * - `uuid` in database
      * - `NOT NULL`, default: `uuid_generate_v4()`
      */
      id?: string | db.Parameter<string> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.DefaultType | db.SQLFragment>;
      /**
      * **User.name**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **User.username**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      username?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **User.password**
      * - `text` in database
      * - `NOT NULL`, no default
      */
      password?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
    }
    export type UniqueIndex = 'User_pkey' | 'User_username_key';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = Table | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Whereable | Column | db.ParentColumn | db.GenericSQLExpression;
    export type SQL = SQLExpression | SQLExpression[];
  }

  /* --- aggregate types --- */

  export namespace public {  
    export type Table = Message.Table | User.Table;
    export type Selectable = Message.Selectable | User.Selectable;
    export type JSONSelectable = Message.JSONSelectable | User.JSONSelectable;
    export type Whereable = Message.Whereable | User.Whereable;
    export type Insertable = Message.Insertable | User.Insertable;
    export type Updatable = Message.Updatable | User.Updatable;
    export type UniqueIndex = Message.UniqueIndex | User.UniqueIndex;
    export type Column = Message.Column | User.Column;
  
    export type AllBaseTables = [Message.Table, User.Table];
    export type AllForeignTables = [];
    export type AllViews = [];
    export type AllMaterializedViews = [];
    export type AllTablesAndViews = [Message.Table, User.Table];
  }



  /* === global aggregate types === */

  export type Schema = 'public';
  export type Table = public.Table;
  export type Selectable = public.Selectable;
  export type JSONSelectable = public.JSONSelectable;
  export type Whereable = public.Whereable;
  export type Insertable = public.Insertable;
  export type Updatable = public.Updatable;
  export type UniqueIndex = public.UniqueIndex;
  export type Column = public.Column;

  export type AllSchemas = ['public'];
  export type AllBaseTables = [...public.AllBaseTables];
  export type AllForeignTables = [...public.AllForeignTables];
  export type AllViews = [...public.AllViews];
  export type AllMaterializedViews = [...public.AllMaterializedViews];
  export type AllTablesAndViews = [...public.AllTablesAndViews];


  /* === lookups === */

  export type SelectableForTable<T extends Table> = {
    "Message": Message.Selectable;
    "User": User.Selectable;
  }[T];

  export type JSONSelectableForTable<T extends Table> = {
    "Message": Message.JSONSelectable;
    "User": User.JSONSelectable;
  }[T];

  export type WhereableForTable<T extends Table> = {
    "Message": Message.Whereable;
    "User": User.Whereable;
  }[T];

  export type InsertableForTable<T extends Table> = {
    "Message": Message.Insertable;
    "User": User.Insertable;
  }[T];

  export type UpdatableForTable<T extends Table> = {
    "Message": Message.Updatable;
    "User": User.Updatable;
  }[T];

  export type UniqueIndexForTable<T extends Table> = {
    "Message": Message.UniqueIndex;
    "User": User.UniqueIndex;
  }[T];

  export type ColumnForTable<T extends Table> = {
    "Message": Message.Column;
    "User": User.Column;
  }[T];

  export type SQLForTable<T extends Table> = {
    "Message": Message.SQL;
    "User": User.SQL;
  }[T];

}