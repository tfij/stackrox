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
	// CreateTableReportConfigurationsStmt holds the create statement for table `report_configurations`.
	CreateTableReportConfigurationsStmt = &postgres.CreateStmts{
		Table: `
               create table if not exists report_configurations (
                   Id varchar,
                   Name varchar,
                   Type integer,
                   serialized bytea,
                   PRIMARY KEY(Id)
               )
               `,
		GormModel: (*ReportConfigurations)(nil),
		Indexes:   []string{},
		Children:  []*postgres.CreateStmts{},
	}

	// ReportConfigurationsSchema is the go schema for table `report_configurations`.
	ReportConfigurationsSchema = func() *walker.Schema {
		schema := globaldb.GetSchemaForTable("report_configurations")
		if schema != nil {
			return schema
		}
		schema = walker.Walk(reflect.TypeOf((*storage.ReportConfiguration)(nil)), "report_configurations")
		schema.SetOptionsMap(search.Walk(v1.SearchCategory_REPORT_CONFIGURATIONS, "reportconfiguration", (*storage.ReportConfiguration)(nil)))
		globaldb.RegisterTable(schema)
		return schema
	}()
)

const (
	ReportConfigurationsTableName = "report_configurations"
)

// ReportConfigurations holds the Gorm model for Postgres table `report_configurations`.
type ReportConfigurations struct {
	Id         string                                 `gorm:"column:id;type:varchar;primaryKey"`
	Name       string                                 `gorm:"column:name;type:varchar"`
	Type       storage.ReportConfiguration_ReportType `gorm:"column:type;type:integer"`
	Serialized []byte                                 `gorm:"column:serialized;type:bytea"`
}
