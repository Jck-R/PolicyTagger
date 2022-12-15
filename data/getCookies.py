import browser_cookie3
import json

cj = browser_cookie3.firefox()

cookies = cj._cookies[".policystat.com"]
cookiesJson = {}
for path in cookies:
	# cookiesJson.append({
	# 	"path": path
	# })
	for key in cookies[path]:
		cookiesJson[cookies[path][key].name] = cookies[path][key].value

with open("cookies.json", "w") as f:
	f.write(json.dumps(cookiesJson))