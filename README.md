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

## Note for data structure when new version released

- `pax_local_map_v{ver}.csv` is the pax local csv file with additional columns added. These include:
`'agt_dat', 'year','stage_label','description','PAX_Hyperlink','PDF_Hyperlink', 'PAX_Local_Hyperlink', 'local_search`
- make sure date ('Dat') column is formatted like `'%Y-%m-%d'` or timeline function will not work.
- `stage_label` values must match exactly (including spelling and punctuation), as they are used directly for:
  - map colours
  - timeline colours
  - filters

Expected values include:
- Pre-negotiation/process
- Ceasefire
- Framework-substantive, partial
- Framework-substantive, comprehensive
- Implementation
- Renewal
- Other

- If a new `stage_label` category is introduced, it must be added in:
  - `map.addLayer` → `circle-color` match
  - beeswarm timeline colour switch in `index.js`
  - legend in `index.html`
  - filter button logic in `index.js`

- The `Stage` column (e.g. Pre, Cea, SubPar) is used for timeline positioning
- The `stage_label` column is used for display and colouring

## Local testing

Run a local server (to test new data locally before pushing):

`python -m http.server`

Then open:
http://localhost:8000

## Common issues

- **Timeline not showing / only one point**
  → Check `Dat` format is `YYYY-MM-DD`

- **Points appear grey**
  → `stage_label` does not match expected values exactly

- **Filter not working**
  → Missing class in legend (e.g. `.com`) or missing JS handler

- **New category not appearing**
  → Must be added in JS colour mapping + legend + filters

## V10 Changes - done by NH on 8th April 2026:
1. data updated
2. made sure all say 'pre-negotiation/process' rather than just 'pre-negotiation'
3. added substantive, comprehensive as there are now local SubComp agts
4. 0,0 coordinates for Nepalese agreements: jittered them around central point in Nepal for the purposes of this map. 