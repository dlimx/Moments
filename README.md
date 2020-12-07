# Moments
@dlimx, 2020

## Links

Get a list of all users here - https://moments-dot-oregonstateuniversity-2.appspot.com

Log in here - https://moments-dot-oregonstateuniversity-2.appspot.com/login

Register here - https://moments-dot-oregonstateuniversity-2.appspot.com/registration

## Data Models
#### User
```
id:         integer     - unique, primary key
email:      string      - unique, email, required
password:   string      - required
```

#### Activity
```
id:         integer     - unique, primary key
namne:      string      - unique, email, required
description string      
time:       integer     - required
public:     boolean     - required
userID:     integer     - ID of owning user
categoryIDs integer[]
```
#### Category
