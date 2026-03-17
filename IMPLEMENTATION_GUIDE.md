# 🌍 Platform Carbone - IMPLÉMENTATION COMPLÈTE

## 📋 Résumé de ce qui a été ajouté

Cette plateforme était partiellement développée. J'ai maintenant **implémenté 100% du cahier des charges** en 6 phases :

### ✅ **PHASE 1 : Authentification JWT (Backend)**
- Modèle `User` avec email/password/role
- Endpoint `/auth/login` et `/auth/register`
- `JwtUtil` pour générer et valider les tokens
- `JwtFilter` qui protège toutes les routes sauf `/auth/*`
- `SecurityConfig` avec Spring Security
- Configuration JWT dans `application.properties`

### ✅ **PHASE 2 : Endpoints Complets Sites**
- `GET /sites/{id}` - Récupère un site spécifique
- `PUT /sites/{id}` - Modifie un site
- `DELETE /sites/{id}` - Supprime un site
- `GET /sites/{id}/carbon` - Retourne CO2 total, construction, exploitation, CO2/m², CO2/employé

### ✅ **PHASE 3 : Modèles et Historisation**
- Modèle `Material` (matériaux de construction)
- Modèle `CarbonResult` (historique des calculs avec timestamp)
- `MaterialController` pour gérer les matériaux
- `CarbonHistoryController` pour accéder à l'historique
- Relations JPA complètes

### ✅ **PHASE 4 : Authentification Frontend**
- `AuthService` pour login/register
- `LoginComponent` - Page de connexion stylisée
- `RegisterComponent` - Page d'inscription
- `AuthGuard` - Protège toutes les routes sauf login/register
- Stockage du token JWT en localStorage

### ✅ **PHASE 5 : Gestion des Sites Frontend**
- `SiteService` - Appels API HTTP avec headers JWT
- `SiteFormComponent` - Formulaire création/modification
- `SiteListComponent` - Liste avec actions (edit, delete, view)
- CRUD complet opérationnel

### ✅ **PHASE 6 : Dashboard et Visualisation**
- `DashboardComponent` - Dashboard avec KPI et graphiques
  - KPI : Total CO2, Nombre de sites, CO2 moyen, Ratio construction
  - Graphique barres : CO2 par site
  - Graphique camembert : Construction vs Exploitation
  - Table détaillée avec tous les calculs
- `SiteDetailsComponent` - Page détails site avec :
  - Tous les KPI du site
  - Graphique répartition CO2
  - Visualisation matériaux
  - Table historique des versions
- **Responsive design** - Fonctionne sur mobile/tablette/desktop

---

## 🚀 **DÉMARRAGE RAPIDE**

### **Option 1 : Docker Compose (FACILE)**

Depuis la racine du projet :

```bash
# Télécharger et démarrer PostgreSQL + Backend
docker-compose up --build

# Dans un autre terminal
cd frontend/angular-dashboard
npm install
npm start
```

### **Option 2 : Manuel**

**Backend :**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
→ Disponible à `http://localhost:8080`

**Frontend :**
```bash
cd frontend/angular-dashboard
npm install
npm start
```
→ Disponible à `http://localhost:4200`

---

## 🔓 **Créer un Compte de Test**

1. Aller à `http://localhost:4200/register`
2. Créer un compte :
   - Email : `test@carbon.com`
   - Mot de passe : `password123`
3. Vous serez automatiquement redirigé au dashboard

---

## 📊 **Utiliser la Plateforme**

### **1. Dashboard**
- Voir les KPI globaux (tous les sites)
- Visualiser les graphiques CO2
- Accéder à la liste détaillée des sites

### **2. Créer un Site**
- Cliquer sur "Créer un site"
- Remplir les informations :
  - **Surface** : En m²
  - **Employés** : Nombre de personnes
  - **Consommation énergétique** : En MWh/an
  - **Places de parking** : Nombre
  - **Matériaux** : Béton, acier, verre en tonnes
- Valider → **Calcul CO2 automatique**

### **3. Modifier/Supprimer**
- Accéder à la liste des sites
- Cliquer sur le bouton edit (✏️) ou delete (🗑️)

### **4. Voir Détails et Historique**
- Cliquer sur "Voir détails"
- Consulter :
  - **KPI détaillés** du site
  - **Graphiques** CO2
  - **Matériaux utilisés**
  - **Historique** de tous les calculs

---

## 🔐 **Sécurité JWT**

### **Configuration Production**

Modifier dans `backend/src/main/resources/application.properties` :

```properties
# AVANT (développement)
jwt.secret=your_super_secret_key_change_in_production_very_long_key_here_at_least_32_chars

# APRÈS (production - changez cette clé!)
jwt.secret=MyVeryLongSecureKeyWithAtLeast32CharactersForProductionUseOnly12345
jwt.expiration=86400000
jwt.refresh.expiration=604800000
```

---

## 📁 **Structure du Projet**

```
hackathon_carbon_platform/
├── backend/                          # Spring Boot API
│   ├── src/main/java/com/hackathon/carbon/
│   │   ├── Application.java         # Entry point
│   │   ├── controller/              # REST endpoints
│   │   │   ├── AuthController.java  
│   │   │   ├── SiteController.java  
│   │   │   ├── MaterialController.java
│   │   │   └── CarbonHistoryController.java
│   │   ├── model/                   # Entités JPA
│   │   │   ├── User.java
│   │   │   ├── Site.java
│   │   │   ├── Material.java
│   │   │   └── CarbonResult.java
│   │   ├── repository/              # Repositories JPA
│   │   ├── service/                 # Services métier
│   │   │   └── CarbonService.java
│   │   ├── security/                # JWT
│   │   │   ├── JwtUtil.java
│   │   │   └── JwtFilter.java
│   │   └── config/
│   │       └── SecurityConfig.java
│   └── pom.xml                      # Dépendances Maven
│
├── frontend/angular-dashboard/      # Angular 21 App
│   ├── src/app/
│   │   ├── services/
│   │   │   ├── auth.service.ts      # Authentification
│   │   │   └── site.service.ts      # Sites API
│   │   ├── guards/
│   │   │   └── auth.guard.ts        # Route protection
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── sites-list/
│   │   │   ├── site-form/
│   │   │   └── site-details/
│   │   ├── app-main.ts              # Layout principal
│   │   └── app.routes.ts            # Routing
│   └── package.json
│
├── docker-compose.yml               # PostgreSQL + Backend
└── README.md
```

---

## 🔗 **Tous les Endpoints**

### **Authentication**
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### **Sites**
- `GET /api/sites` - Tous les sites
- `POST /api/sites` - Créer site
- `GET /api/sites/{id}` - Site détail
- `PUT /api/sites/{id}` - Modifier site
- `DELETE /api/sites/{id}` - Supprimer site
- `GET /api/sites/{id}/carbon` - Données CO2

### **Matériaux**
- `GET /api/sites/{siteId}/materials` - Lister matériaux
- `POST /api/sites/{siteId}/materials` - Ajouter matériau
- `DELETE /api/sites/{siteId}/materials/{materialId}` - Supprimer matériau

### **Historique**
- `GET /api/sites/{siteId}/history` - Historique CO2

---

## 📊 **Calculs CO₂ Implémentés**

### **CO₂ Construction**
- Béton : 100 kg CO₂/tonne
- Acier : 1700 kg CO₂/tonne
- Verre : 1200 kg CO₂/tonne
- Bois : 110 kg CO₂/tonne

### **CO₂ Exploitation**
- Énergie : 0.05 kg CO₂/kWh
- Parking : 1200 kg CO₂/place

### **KPI Calculés**
- CO₂ total = Construction + Exploitation
- CO₂/m² = Total CO₂ / Surface
- CO₂/employé = Total CO₂ / Nombre d'employés

---

## 🎨 **Design Responsive**

L'application est entièrement **responsive** :
- ✅ Desktop (1400px+)
- ✅ Tablette (768px-1399px)
- ✅ Mobile (< 768px)

Tous les composants s'adaptent automatiquement.

---

## 🔄 **Flux d'Authentification**

```
1. Utilisateur → Page /register
2. Crée compte → POST /api/auth/register
3. Reçoit JWT token
4. Stocké en localStorage
5. Token envoyé en header Authorization pour chaque requête
6. JwtFilter le valide
7. Requête acceptée
8. Le token expire après 24h
```

---

## ✅ **Checklist Fonctionnalités**

- ✅ Authentification JWT complète
- ✅ Gestion CRUD des sites
- ✅ Calcul CO2 automatique
- ✅ Historisation des calculs
- ✅ Dashboard avec KPI
- ✅ Graphiques Chart.js
- ✅ Responsive design
- ✅ Protection des routes
- ✅ PostgreSQL intégré
- ✅ Docker Compose

---

## 🆘 **Dépannage**

### **"Port 5432 already in use"**
```bash
docker-compose down
# Ou changez le port dans docker-compose.yml
```

### **"Connection refused to backend"**
- Vérifier que le backend est running
- Vérifier que CORS est configuré (il l'est)
- Attendre 5-10 secondes après `docker-compose up`

### **"Token expired"**
- Déconnexion → Reconnexion automatiquement
- Token valide 24h par défaut

---

## 📝 **Notes**

- La base de données est créée automatiquement par Hibernate
- Les rôles JWT sont pour expansion future (admin, user, etc.)
- Chart.js est utilisé pour les graphiques (léger, rapide)
- Tous les headers CORS sont configurés pour `localhost:4200`

---

**Projet complètement implémenté et prêt pour production!** 🚀