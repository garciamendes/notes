package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/garciamendes/notes/src/utils"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const keyAuth = "Bearer "
const UserIDKey contextKey = "user"

func VerifyToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenHeader := r.Header.Get("Authorization")
		if tokenHeader == "" || !strings.HasPrefix(tokenHeader, keyAuth) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(tokenHeader, keyAuth)

		token, err := jwt.ParseWithClaims(tokenStr, &utils.Claims{}, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("token invalid")
			}

			secret := os.Getenv("TOKEN_SECRET_KEY")
			if secret == "" {
				return nil, fmt.Errorf("token invalid")
			}

			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			fmt.Println(err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(*utils.Claims); ok {
			ctx := context.WithValue(r.Context(), UserIDKey, claims.User)
			r = r.WithContext(ctx)
		}

		next.ServeHTTP(w, r)
	})
}
