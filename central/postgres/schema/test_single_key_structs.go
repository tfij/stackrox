// Code generated by pg-bindings generator. DO NOT EDIT.

package schema

import (
	"reflect"
	"time"

	"github.com/lib/pq"
	"github.com/stackrox/rox/central/globaldb"
	v1 "github.com/stackrox/rox/generated/api/v1"
	"github.com/stackrox/rox/generated/storage"
	"github.com/stackrox/rox/pkg/postgres"
	"github.com/stackrox/rox/pkg/postgres/walker"
	"github.com/stackrox/rox/pkg/search"
)

var (
	// CreateTableTestSingleKeyStructsStmt holds the create statement for table `test_single_key_structs`.
	CreateTableTestSingleKeyStructsStmt = &postgres.CreateStmts{
		Table: `
               create table if not exists test_single_key_structs (
                   Key varchar,
                   Name varchar UNIQUE,
                   StringSlice text[],
                   Bool bool,
                   Uint64 integer,
                   Int64 integer,
                   Float numeric,
                   Labels jsonb,
                   Timestamp timestamp,
                   Enum integer,
                   Enums int[],
                   serialized bytea,
                   PRIMARY KEY(Key)
               )
               `,
		GormModel: (*TestSingleKeyStructs)(nil),
		Indexes: []string{
			"create index if not exists testSingleKeyStructs_Key on test_single_key_structs using hash(Key)",
		},
		Children: []*postgres.CreateStmts{},
	}

	// TestSingleKeyStructsSchema is the go schema for table `test_single_key_structs`.
	TestSingleKeyStructsSchema = func() *walker.Schema {
		schema := globaldb.GetSchemaForTable("test_single_key_structs")
		if schema != nil {
			return schema
		}
		schema = walker.Walk(reflect.TypeOf((*storage.TestSingleKeyStruct)(nil)), "test_single_key_structs")
		schema.SetOptionsMap(search.Walk(v1.SearchCategory_SEARCH_UNSET, "testsinglekeystruct", (*storage.TestSingleKeyStruct)(nil)))
		globaldb.RegisterTable(schema)
		return schema
	}()
)

const (
	TestSingleKeyStructsTableName = "test_single_key_structs"
)

// TestSingleKeyStructs holds the Gorm model for Postgres table `test_single_key_structs`.
type TestSingleKeyStructs struct {
	Key         string                           `gorm:"column:key;type:varchar;primaryKey;index:testsinglekeystructs_key,type:hash"`
	Name        string                           `gorm:"column:name;type:varchar;unique"`
	StringSlice *pq.StringArray                  `gorm:"column:stringslice;type:text[]"`
	Bool        bool                             `gorm:"column:bool;type:bool"`
	Uint64      uint64                           `gorm:"column:uint64;type:integer"`
	Int64       int64                            `gorm:"column:int64;type:integer"`
	Float       float32                          `gorm:"column:float;type:numeric"`
	Labels      map[string]string                `gorm:"column:labels;type:jsonb"`
	Timestamp   *time.Time                       `gorm:"column:timestamp;type:timestamp"`
	Enum        storage.TestSingleKeyStruct_Enum `gorm:"column:enum;type:integer"`
	Enums       *pq.Int32Array                   `gorm:"column:enums;type:int[]"`
	Serialized  []byte                           `gorm:"column:serialized;type:bytea"`
}
