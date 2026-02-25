#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# build-and-deploy.sh
# Builds all container images and deploys to OpenShift
#
# Prerequisites:
#   - oc CLI logged into your cluster
#   - podman or docker available
#   - Update REGISTRY below to your image registry
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REGISTRY="${REGISTRY:-image-registry.openshift-image-registry.svc:5000}"
TAG="${TAG:-latest}"

# ── Build images ─────────────────────────────────────────────────────────────
echo "==> Building images..."

podman build -t "${REGISTRY}/api-frontend/api-orchestration-console:${TAG}"  ./frontend
podman build -t "${REGISTRY}/api-external/formula1-api:${TAG}"               ./api-f1
podman build -t "${REGISTRY}/api-external/football-api:${TAG}"               ./api-football
podman build -t "${REGISTRY}/api-external/cricket-api:${TAG}"                ./api-cricket
podman build -t "${REGISTRY}/api-external/tennis-api:${TAG}"                 ./api-tennis

# ── Push images ───────────────────────────────────────────────────────────────
echo "==> Pushing images..."

podman push "${REGISTRY}/api-frontend/api-orchestration-console:${TAG}"
podman push "${REGISTRY}/api-external/formula1-api:${TAG}"
podman push "${REGISTRY}/api-external/football-api:${TAG}"
podman push "${REGISTRY}/api-external/cricket-api:${TAG}"
podman push "${REGISTRY}/api-external/tennis-api:${TAG}"

# ── Update image references in manifests ─────────────────────────────────────
echo "==> Updating image references..."

sed -i "s|api-orchestration-console:latest|${REGISTRY}/api-frontend/api-orchestration-console:${TAG}|g" k8s/namespace1/frontend.yaml
sed -i "s|formula1-api:latest|${REGISTRY}/api-external/formula1-api:${TAG}|g"   k8s/namespace2/external-apis.yaml
sed -i "s|football-api:latest|${REGISTRY}/api-external/football-api:${TAG}|g"   k8s/namespace2/external-apis.yaml
sed -i "s|cricket-api:latest|${REGISTRY}/api-external/cricket-api:${TAG}|g"     k8s/namespace2/external-apis.yaml
sed -i "s|tennis-api:latest|${REGISTRY}/api-external/tennis-api:${TAG}|g"       k8s/namespace2/external-apis.yaml

# ── Deploy to OpenShift ───────────────────────────────────────────────────────
echo "==> Deploying Namespace 2 (external APIs)..."
oc apply -f k8s/namespace2/external-apis.yaml
oc apply -f k8s/namespace2/networkpolicy.yaml

echo "==> Deploying Namespace 1 (frontend)..."
oc apply -f k8s/namespace1/frontend.yaml

echo ""
echo "==> Done! Check rollout status:"
echo "    oc rollout status deployment/api-orchestration-console -n api-frontend"
echo "    oc rollout status deployment/formula1-api  -n api-external"
echo "    oc rollout status deployment/football-api  -n api-external"
echo "    oc rollout status deployment/cricket-api   -n api-external"
echo "    oc rollout status deployment/tennis-api    -n api-external"
