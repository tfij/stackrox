// Code generated by pg-bindings generator. DO NOT EDIT.

package schema

import (
	"reflect"

	"github.com/stackrox/rox/central/globaldb"
	v1 "github.com/stackrox/rox/generated/api/v1"
	"github.com/stackrox/rox/generated/storage"
	"github.com/stackrox/rox/pkg/postgres"
	"github.com/stackrox/rox/pkg/postgres/walker"
	"github.com/stackrox/rox/pkg/search"
)

var (
	// CreateTableTestChild1Stmt holds the create statement for table `test_child1`.
	CreateTableTestChild1Stmt = &postgres.CreateStmts{
		Table: `
               create table if not exists test_child1 (
                   Id varchar,
                   Val varchar,
                   serialized bytea,
                   PRIMARY KEY(Id)
               )
               `,
		GormModel: (*TestChild1)(nil),
		Indexes:   []string{},
		Children:  []*postgres.CreateStmts{},
	}

	// TestChild1Schema is the go schema for table `test_child1`.
	TestChild1Schema = func() *walker.Schema {
		schema := globaldb.GetSchemaForTable("test_child1")
		if schema != nil {
			return schema
		}
		schema = walker.Walk(reflect.TypeOf((*storage.TestChild1)(nil)), "test_child1")
		schema.SetOptionsMap(search.Walk(v1.SearchCategory(63), "testchild1", (*storage.TestChild1)(nil)))
		globaldb.RegisterTable(schema)
		return schema
	}()
)

const (
	TestChild1TableName = "test_child1"
)

// TestChild1 holds the Gorm model for Postgres table `test_child1`.
type TestChild1 struct {
	Id         string `gorm:"column:id;type:varchar;primaryKey"`
	Val        string `gorm:"column:val;type:varchar"`
	Serialized []byte `gorm:"column:serialized;type:bytea"`
}
