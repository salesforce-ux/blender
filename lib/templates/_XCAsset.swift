import Foundation
import UIKit
enum XCAsset: String {
  <% _.forEach(icons, function(icon) { %>case <%- _.camelCase(icon) %> = "<%- icon %>"
  <% }); %>
}
