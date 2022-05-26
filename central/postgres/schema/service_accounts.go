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
	// CreateTableServiceAccountsStmt holds the create statement for table `service_accounts`.
	CreateTableServiceAccountsStmt = &postgres.CreateStmts{
		Table: `
               create table if not exists service_accounts (
                   Id varchar,
                   Name varchar,
                   Namespace varchar,
                   ClusterName varchar,
                   ClusterId varchar,
                   Labels jsonb,
                   Annotations jsonb,
                   serialized bytea,
                   PRIMARY KEY(Id)
               )
               `,
		GormModel: (*ServiceAccounts)(nil),
		Indexes:   []string{},
		Children:  []*postgres.CreateStmts{},
	}

	// ServiceAccountsSchema is the go schema for table `service_accounts`.
	ServiceAccountsSchema = func() *walker.Schema {
		schema := globaldb.GetSchemaForTable("service_accounts")
		if schema != nil {
			return schema
		}
		schema = walker.Walk(reflect.TypeOf((*storage.ServiceAccount)(nil)), "service_accounts")
		schema.SetOptionsMap(search.Walk(v1.SearchCategory_SERVICE_ACCOUNTS, "serviceaccount", (*storage.ServiceAccount)(nil)))
		globaldb.RegisterTable(schema)
		return schema
	}()
)

const (
	ServiceAccountsTableName = "service_accounts"
)

// ServiceAccounts holds the Gorm model for Postgres table `service_accounts`.
type ServiceAccounts struct {
	Id          string            `gorm:"column:id;type:varchar;primaryKey"`
	Name        string            `gorm:"column:name;type:varchar"`
	Namespace   string            `gorm:"column:namespace;type:varchar"`
	ClusterName string            `gorm:"column:clustername;type:varchar"`
	ClusterId   string            `gorm:"column:clusterid;type:varchar"`
	Labels      map[string]string `gorm:"column:labels;type:jsonb"`
	Annotations map[string]string `gorm:"column:annotations;type:jsonb"`
	Serialized  []byte            `gorm:"column:serialized;type:bytea"`
}
