import { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

const RESOURCE_OPTIONS = [
  "messages",
  "memberships",
  "rooms",
  "attachmentActions",
  "meetings",
  "recordings",
];

const EVENT_OPTIONS = ["created", "updated", "deleted"];

type WebhookFormData = {
  name: string;
  accessToken: string;
  targetUrl: string;
  resource: string;
  event: string;
  filter?: string;
  secret?: string;
};

type WebhookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WebhookModal({ isOpen, onClose }: WebhookModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WebhookFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showToken, setShowToken] = useState(false);

  const onSubmit = async (data: WebhookFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Set the target URL to our endpoint
      const targetUrl = `https://askit.digitalgurus.link/api/webhooks/incoming`;

      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          targetUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create webhook");
      }

      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Configure Webex Webhook
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Webhook Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="My Webhook"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="accessToken"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Webex Access Token
              </label>
              <div className="relative">
                <input
                  id="accessToken"
                  type={showToken ? "text" : "password"}
                  {...register("accessToken", {
                    required: "Access token is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.accessToken ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Bearer token"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showToken ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.accessToken && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.accessToken.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                The access token must have the appropriate scopes for the
                webhook
              </p>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="targetUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Target URL
              </label>
              <div className="flex">
                <input
                  id="targetUrl"
                  type="text"
                  value="https://askit.digitalgurus.link/api/webhooks/incoming"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                This is the endpoint where Webex will send webhook events
              </p>
            </div>

            <div>
              <label
                htmlFor="resource"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resource
              </label>
              <select
                id="resource"
                {...register("resource", { required: "Resource is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {RESOURCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.resource && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.resource.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="event"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event
              </label>
              <select
                id="event"
                {...register("event", { required: "Event is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {EVENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.event && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.event.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter (optional)
              </label>
              <input
                id="filter"
                type="text"
                {...register("filter")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., roomId=Y2lzY29zcGFyazovL3VzL1JPT00v..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Filter to limit which events trigger the webhook
              </p>
            </div>

            <div>
              <label
                htmlFor="secret"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Secret (optional)
              </label>
              <input
                id="secret"
                type="text"
                {...register("secret")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Your secret key"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used to verify webhook events come from Webex
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Webhook"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
