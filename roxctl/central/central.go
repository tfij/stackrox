package central

import (
	"github.com/spf13/cobra"
	"github.com/stackrox/rox/roxctl/central/cert"
	"github.com/stackrox/rox/roxctl/central/db"
	"github.com/stackrox/rox/roxctl/central/debug"
	"github.com/stackrox/rox/roxctl/central/generate"
	"github.com/stackrox/rox/roxctl/central/license"
	"github.com/stackrox/rox/roxctl/central/userpki"
	"github.com/stackrox/rox/roxctl/central/whoami"
)

// Command defines the central command tree
func Command() *cobra.Command {
	c := &cobra.Command{
		Use: "central",
	}

	c.AddCommand(
		cert.Command(),
		generate.Command(),
		db.Command(),
		debug.Command(),
		license.Command(),
		userpki.Command(),
		whoami.Command(),
	)
	return c
}
