// Code generated by pg-bindings generator. DO NOT EDIT.

package schema

import (
	"fmt"
	"reflect"

	"github.com/stackrox/rox/central/globaldb"
	v1 "github.com/stackrox/rox/generated/api/v1"
	"github.com/stackrox/rox/generated/storage"
	"github.com/stackrox/rox/pkg/postgres"
	"github.com/stackrox/rox/pkg/postgres/walker"
	"github.com/stackrox/rox/pkg/search"
)

var (
	// CreateTableImageComponentEdgesStmt holds the create statement for table `image_component_edges`.
	CreateTableImageComponentEdgesStmt = &postgres.CreateStmts{
		Table: `
               create table if not exists image_component_edges (
                   Id varchar,
                   Location varchar,
                   ImageId varchar,
                   ImageComponentId varchar,
                   serialized bytea,
                   PRIMARY KEY(Id, ImageId, ImageComponentId),
                   CONSTRAINT fk_parent_table_0 FOREIGN KEY (ImageId) REFERENCES images(Id) ON DELETE CASCADE
               )
               `,
		GormModel: (*ImageComponentEdges)(nil),
		Indexes:   []string{},
		Children:  []*postgres.CreateStmts{},
	}

	// ImageComponentEdgesSchema is the go schema for table `image_component_edges`.
	ImageComponentEdgesSchema = func() *walker.Schema {
		schema := globaldb.GetSchemaForTable("image_component_edges")
		if schema != nil {
			return schema
		}
		schema = walker.Walk(reflect.TypeOf((*storage.ImageComponentEdge)(nil)), "image_component_edges")
		referencedSchemas := map[string]*walker.Schema{
			"storage.Image":          ImagesSchema,
			"storage.ImageComponent": ImageComponentsSchema,
		}

		schema.ResolveReferences(func(messageTypeName string) *walker.Schema {
			return referencedSchemas[fmt.Sprintf("storage.%s", messageTypeName)]
		})
		schema.SetOptionsMap(search.Walk(v1.SearchCategory_IMAGE_COMPONENT_EDGE, "imagecomponentedge", (*storage.ImageComponentEdge)(nil)))
		globaldb.RegisterTable(schema)
		return schema
	}()
)

const (
	ImageComponentEdgesTableName = "image_component_edges"
)

// ImageComponentEdges holds the Gorm model for Postgres table `image_component_edges`.
type ImageComponentEdges struct {
	Id               string `gorm:"column:id;type:varchar;primaryKey"`
	Location         string `gorm:"column:location;type:varchar"`
	ImageId          string `gorm:"column:imageid;type:varchar;primaryKey"`
	ImageComponentId string `gorm:"column:imagecomponentid;type:varchar;primaryKey"`
	Serialized       []byte `gorm:"column:serialized;type:bytea"`
	ImagesRef        Images `gorm:"foreignKey:imageid;references:id;belongsTo;constraint:OnDelete:CASCADE"`
}
