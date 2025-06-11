package handlers

import (
	"encoding/json"
	"net/http"
)

type UserHandler struct {
	handler *Handler
}

func (h *Handler) User() *UserHandler {
	return &UserHandler{handler: h}
}

func (handler UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode("Hello")
}
