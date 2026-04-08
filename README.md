# PA-X Local

## Update

1. Replace 1 csv file inside data with updates:  
   `pax_local_map_v[new_version].csv`

2. Update file names in `js/index.js` on line 243:
```js
Promise.all([
    d3.csv("data/pax_local_map_v[new_version].csv"),
]).then(function (files) {
```

3. Deploy
```bash
git add .
git commit -m "message"
git push
```