package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/garciamendes/notes/src/db"
	"github.com/garciamendes/notes/src/handlers"
	"github.com/garciamendes/notes/src/routes"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error load 'ENVS': ", err)
	}

	DB := db.Init()
	if DB.Error != nil {
		log.Fatal(DB.Error)
		return
	}

	handlers := handlers.New(DB)
	router := mux.NewRouter()
	api := router.PathPrefix("/api").Subrouter()

	userRoutes := api.PathPrefix("/user").Subrouter()
	routes.UserRoutes(userRoutes, handlers)

	noteRoutes := api.PathPrefix("/notes").Subrouter()
	routes.NoteRoutes(noteRoutes, handlers)

	allowHost := os.Getenv("ALLOW_HOST")
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   strings.Split(allowHost, ","),
		AllowedMethods:   []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	http.ListenAndServe(":8080", corsHandler.Handler(router))
}
