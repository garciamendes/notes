package routes

import (
	"net/http"

	"github.com/garciamendes/notes/src/handlers"
	"github.com/garciamendes/notes/src/middlewares"
	"github.com/gorilla/mux"
)

func NoteRoutes(r *mux.Router, h *handlers.Handler) {
	protected := r.NewRoute().Subrouter()
	protected.Use(middlewares.VerifyToken)

	protected.HandleFunc("", h.Note().List).Methods(http.MethodGet)
}
