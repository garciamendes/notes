package routes

import (
	"net/http"

	"github.com/garciamendes/notes/src/handlers"
	"github.com/garciamendes/notes/src/middlewares"
	"github.com/gorilla/mux"
)

func UserRoutes(r *mux.Router, h *handlers.Handler) {
	r.HandleFunc("/register", h.User().Register).Methods(http.MethodPost)
	r.HandleFunc("/login", h.User().Login).Methods(http.MethodPost)

	protected := r.NewRoute().Subrouter()
	protected.Use(middlewares.VerifyToken)
	protected.HandleFunc("/me", h.User().Me).Methods(http.MethodGet)
}
