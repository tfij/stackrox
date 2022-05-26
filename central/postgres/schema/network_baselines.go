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
	// CreateTableNetworkBaselinesStmt holds the create statement for table `network_baselines`.
	CreateTableNetworkBaselinesStmt = &postgres.CreateStmts{
		Table: `
               create table if not exists network_baselines (
                   DeploymentId varchar,
                   serialized bytea,
                   PRIMARY KEY(DeploymentId)
               )
               `,
		GormModel: (*NetworkBaselines)(nil),
		Indexes:   []string{},
		Children:  []*postgres.CreateStmts{},
	}

	// NetworkBaselinesSchema is the go schema for table `network_baselines`.
	NetworkBaselinesSchema = func() *walker.Schema {
		schema := globaldb.GetSchemaForTable("network_baselines")
		if schema != nil {
			return schema
		}
		schema = walker.Walk(reflect.TypeOf((*storage.NetworkBaseline)(nil)), "network_baselines")
		globaldb.RegisterTable(schema)
		return schema
	}()
)

const (
	NetworkBaselinesTableName = "network_baselines"
)

// NetworkBaselines holds the Gorm model for Postgres table `network_baselines`.
type NetworkBaselines struct {
	DeploymentId string `gorm:"column:deploymentid;type:varchar;primaryKey"`
	Serialized   []byte `gorm:"column:serialized;type:bytea"`
}
