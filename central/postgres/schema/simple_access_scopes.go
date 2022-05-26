// Code generated by pg-bindings generator. DO NOT EDIT.

package schema

import (
	"reflect"

	"github.com/stackrox/rox/central/globaldb"
	"github.com/stackrox/rox/generated/storage"
	"github.com/stackrox/rox/pkg/postgres"
	"github.com/stackrox/rox/pkg/postgres/walker"
)

var (
	// CreateTableSimpleAccessScopesStmt holds the create statement for table `simple_access_scopes`.
	CreateTableSimpleAccessScopesStmt = &postgres.CreateStmts{
		Table: `
               create table if not exists simple_access_scopes (
                   Id varchar,
                   Name varchar UNIQUE,
                   serialized bytea,
                   PRIMARY KEY(Id)
               )
               `,
		GormModel: (*SimpleAccessScopes)(nil),
		Indexes:   []string{},
		Children:  []*postgres.CreateStmts{},
	}

	// SimpleAccessScopesSchema is the go schema for table `simple_access_scopes`.
	SimpleAccessScopesSchema = func() *walker.Schema {
		schema := globaldb.GetSchemaForTable("simple_access_scopes")
		if schema != nil {
			return schema
		}
		schema = walker.Walk(reflect.TypeOf((*storage.SimpleAccessScope)(nil)), "simple_access_scopes")
		globaldb.RegisterTable(schema)
		return schema
	}()
)

const (
	SimpleAccessScopesTableName = "simple_access_scopes"
)

// SimpleAccessScopes holds the Gorm model for Postgres table `simple_access_scopes`.
type SimpleAccessScopes struct {
	Id         string `gorm:"column:id;type:varchar;primaryKey"`
	Name       string `gorm:"column:name;type:varchar;unique"`
	Serialized []byte `gorm:"column:serialized;type:bytea"`
}
